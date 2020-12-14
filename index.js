// Dotenv setup
require('dotenv').config()

// Fastify instancing
const fastify = require("fastify")({
    logger : true
})

// Mongoose
const mongoose = require("mongoose")
mongoose.connect(`${process.env.DB_HOST}/${process.env.DB_DATABASE}`, { useNewUrlParser: true, useUnifiedTopology: true })

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
                message: "You are not authorized!"
            })
        done()        
    }
})

fastify.register(require("./src/routes/sample"))

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