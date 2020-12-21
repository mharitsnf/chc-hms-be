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
            }
        },
        (_request, reply) => {
            reply.send({ hello: "world" })
        }
    )

    fastify.get(
        '/unauthorized',
        {
            preValidation: [fastify.authenticate]
        },
        (_request, reply) => {
            reply.send({ data: "OK you good" })
        }
    )
}

module.exports = routes