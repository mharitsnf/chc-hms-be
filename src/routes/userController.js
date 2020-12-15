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
                    message: error.message ? error.message : 'No message provided',
                    details: error
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
                    message: error.message ? error.message : 'No message provided',
                    details: error
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
                    required: ['fullname', 'nickname'],
                    properties: {
                        fullname: { type:  'string' },
                        nickname: { type:  'string' },
                        KIP: { type:  'string' },
                        username: { type:  'string' },
                        password: { type:  'string' },
                        email: { type:  'string' },
                        last_login: { type:  'object', format: 'date-time' }
                    }
                }
            }
        },
        async (request, reply) => {
            try {
                const body = request.body

                if (body.password != null) {
                    const bcrypt = require('bcrypt')
                    const password = await bcrypt.hash(body.password, 10)
                    body.password = password
                }

                const user = new User(body)
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
                    message: error.message ? error.message : 'No message provided',
                    details: error
                }
            }
        }
    )

    fastify.put(
        '/users/:user_id',
        {
            schema: {
                body: {
                    type: 'object',
                    properties: {
                        fullname: { type:  'string' },
                        nickname: { type:  'string' },
                        KIP: { type:  'string' },
                        username: { type:  'string' },
                        password: { type:  'string' },
                        email: { type:  'string' }
                    }
                }
            }
        },
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
                    message: error.message ? error.message : 'No message provided',
                    details: error
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

                if (res == null) {
                    throw new Error('Document not found')
                }

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
                    message: error.message ? error.message : 'No message provided',
                    details: error
                }
            }
        }
    )
}

module.exports = routes