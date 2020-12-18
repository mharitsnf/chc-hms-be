// Dotenv setup
require('dotenv').config()

// Fastify instancing
const fastify = require("fastify")({
    logger : true
})

// Add shared schema
require('./src/schemas/bodies')({ fastify })
require('./src/schemas/serializers')({ fastify })

// Mongoose
const mongoose = require("mongoose")
try {
    mongoose.connect(
        `mongodb://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_DATABASE}?authSource=admin`,
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

// Fastify intialization
const start = async () => {
    try {
        await fastify.listen(3000, '0.0.0.0')
        console.log(`Listening on ${fastify.server.address().port}`)
    } catch (err) {
        fastify.log.error(err)
        process.exit(1)
    }
}

start()