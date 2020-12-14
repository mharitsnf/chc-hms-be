const User = require("../models/userModel")

const routes = async (fastify, options) => {
    fastify.get(
        '/users',
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

    fastify.get(
        '/users/:user_id',
        async (request, reply) => {
            try {
                const user_id = request.params.user_id
                const user = await User.findById(user_id)
                return {
                    statusCode: 200,
                    message: "Successful",
                    data: user
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

    fastify.post(
        '/users',
        {
            schema: {
                body: {
                    type: "object",
                    required: ['fullname'],
                    properties: {
                        fullname: { type:  "string" },
                        nickname: { type:  "string" },
                        KIP: { type:  "string" }
                    }
                }
            }
        },
        async (request, reply) => {
            try {
                const user = new User(request.body)
                const res = await user.save()
                return {
                    statusCode: 200,
                    message: "Successful",
                    data: res
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

    fastify.put(
        '/users/:user_id',
        async (request, reply) => {
            try {
                const user_id = request.params.user_id
                const user = request.body
                const { ...updateData } = user
                const res = await User.findByIdAndUpdate(user_id, updateData, { new: true })
                return {
                    statusCode: 200,
                    message: "Successful",
                    data: res
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

    fastify.delete(
        '/users/:user_id',
        async (request, reply) => {
            try {
                const user_id = request.params.user_id
                const res = await User.findByIdAndRemove(user_id)
                return {
                    statusCode: 200,
                    message: "Successful",
                    data: res
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