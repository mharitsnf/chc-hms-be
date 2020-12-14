const jwt = require("jsonwebtoken")

const routes = async (fastify, options) => {
    fastify.get(
        '/',
        {
            schema: {
                response: {
                    200: {
                        type: "object",
                        properties: {
                            hello: { type: "string" }
                        }
                    }
                }
            },
            preValidation: [fastify.authenticate]
        },
        (_request, reply) => {
            reply.send({ hello: "asu" })
        }
    )
}

module.exports = routes