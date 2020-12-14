// Dotenv setup
require('dotenv').config()

// Fastify instancing
const fastify = require("fastify")({
    logger : true
})

// Mongoose
const mongoose = require("mongoose")
mongoose.connect(
    `mongodb://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_DATABASE}?authSource=admin`,
    { 
        useNewUrlParser: true,
        useUnifiedTopology: true
    }
).then(() => console.log("Mongodb connected"))
.catch((err) => console.log(err))

// JWT setup
const jwt = require("jsonwebtoken")
fastify.decorate("authenticate", (request, reply, done) => {
    try {
        jwt.verify(request.headers.authorization, process.env.JWT_SECRET)        
    } catch (error) {
        reply
            .code(500)
            .send({
                code: 500,
                error: "Internal Server Error",
                data: "You are not authorized!"
            })
        done()        
    }
})

fastify.register(require("./src/routes/sample"))
fastify.register(require("./src/routes/userController"))

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