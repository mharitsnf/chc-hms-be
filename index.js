// Dotenv setup
require('dotenv').config()

// Fastify instancing
const fastify = require("fastify")({
    logger : true
})

// Add shared schema
require('./src/schemas/bodies')({ fastify })
require('./src/schemas/queries')({ fastify })
require('./src/schemas/serializers')({ fastify })

// Mongoose
const mongoose = require("mongoose")
const mongooseAddress = process.env.DB_URL
try {
    mongoose.connect(
        mongooseAddress,
        { 
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false
        }
    )
    console.log("MongoDB connection successful")
} catch (error) {
    console.log("MongoDB connection error")
    console.log(error)
    process.exit(1)
}

// Scheduling with Agenda
const Agenda = require('agenda')
const moment = require('moment')
const agd = new Agenda({ db: {address: mongooseAddress} })

agd.define('remove booked histories', async job => {
    try {
        const AccommodationHistory = require('./src/models/accommodationHistoryModel')
        let res = await AccommodationHistory.updateMany({
            status: 'Booked',
            createdAt: { $lt: moment().subtract(3, 'days').toDate() }
        }, { status: 'Canceled' })
        
        console.log(`Found ${res.n} documents, updated ${res.nModified} documents`)
    } catch (error) {
        console.log(`Removing failed, retrying: ${error.message}`)
    }
})

// JWT setup
const jwt = require("jsonwebtoken")
fastify.decorate("authenticate", (request, reply, done) => {
    try {
        // Authorization: Bearer [jwt token]
        const decoded = jwt.verify(request.headers.authorization.split(" ")[1], process.env.JWT_SECRET)
        request.user = decoded
        done()
    } catch (error) {
        reply
            .code(500)
            .send({
                statusCode: 500,
                message: "Authentication failed",
                detail: error
            })
        done()        
    }
})

fastify.register(require("./src/routes/sample"))
fastify.register(require("./src/routes/authController"))
fastify.register(require("./src/routes/userController"))
fastify.register(require("./src/routes/divisionController"))
fastify.register(require("./src/routes/levelController"))
fastify.register(require("./src/routes/accommodationController"))
fastify.register(require("./src/routes/accommodationCategoryController"))
fastify.register(require("./src/routes/customerController"))
fastify.register(require("./src/routes/accommodationHistoryController"))

// Fastify and Agenda intialization
const start = async () => {
    try {
        await fastify.listen(3000, '0.0.0.0')
        console.log(`Listening on ${fastify.server.address().port}`)

        await agd.start()

        await agd.every('1 minute', 'remove booked histories')

    } catch (err) {
        fastify.log.error(err)
        process.exit(1)
    }
}

start()