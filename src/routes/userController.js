const User = require("../models/userModel")

const routes = async (fastify, options) => {
    fastify.get(
        '/users',
        {
            schema: {
                response: {
                    200: {
                        statusCode: { type: "number" },
                        message: { type: "string" },
                        data: { type: "object" }
                    }
                }
            }
        },
        async (_request, reply) => {
            try {
                const users = await User.find()
                return {
                    statusCode: 200,
                    message: "Successful",
                    data: users
                }          
            } catch (error) {
                reply.code(500)
                return {
                    statusCode: 500,
                    error: "Internal Server Error",
                    message: error
                }
            }
        }
    )
}

module.exports = routes