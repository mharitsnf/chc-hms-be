const fastify = require("fastify")({
    logger : true
})

fastify.register(require("./routes/sample"))

const start = async () => {
    try {
        await fastify.listen(3000, '0.0.0.0')
        console.log("Listening on 0.0.0.0:3000")
    } catch (err) {
        fastify.log.error(err)
        process.exit(1)
    }
}

start()