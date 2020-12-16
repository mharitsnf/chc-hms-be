const User = require("../models/userModel")
const { successOutputs, errorOutputs } = require("../outputs/outputs")

const routes = async (fastify, options) => {
    fastify.get(
        '/users',
        {
            schema: {
                response: {
                    '4xx': { $ref: '4xxSerializer#' }
                }
            }  
        },
        async (_request, reply) => {
            try {
                const users = await User.find()
                return successOutputs(users)

            } catch (error) {
                return errorOutputs(500, error, reply)
            }
        }
    )

    fastify.get(
        '/users/:userId',
        {
            schema: {
                response: {
                    '4xx': { $ref: '4xxSerializer#' }
                }
            }  
        },
        async (request, reply) => {
            try {
                const userId = request.params.userId
                const user = await User.findById(userId)
                return successOutputs(user)

            } catch (error) {
                return errorOutputs(500, error, reply)
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
                        password: { type:  'string', minLength: 6 },
                        email: { type:  'string' },
                        lastLogin: { type:  'object', format: 'date-time' }
                    }
                },
                response: {
                    '4xx': { $ref: '4xxSerializer#' }
                }
            }
        },
        async (request, reply) => {
            try {
                const body = request.body

                if ((body.username != null) !== (body.password != null)) {
                    return errorOutputs(400, new Error('Please provide both username and password or omit both.'), reply)

                } else {
                    if (body.password != null) {
                        const bcrypt = require('bcrypt')
                        body.password = await bcrypt.hash(body.password, 10)
                    }
                }

                const user = new User(body)
                const res = await user.save()
                return successOutputs(res)

            } catch (error) {
                return errorOutputs(500, error, reply)
            }
        }
    )

    fastify.put(
        '/users/:userId',
        {
            schema: {
                body: {
                    type: 'object',
                    properties: {
                        fullname: { type:  'string' },
                        nickname: { type:  'string' },
                        KIP: { type:  'string' },
                        username: { type:  'string' },
                        password: { type:  'string', minLength: 6 },
                        email: { type:  'string' },
                        division: { type:  'string' },
                        level: { type:  'string' }
                    }
                },
                response: {
                    '4xx': { $ref: '4xxSerializer#' }
                }
            }
        },
        async (request, reply) => {
            try {
                const userId = request.params.userId
                const body = request.body
                const user = await User.findById(userId)

                if (user.username == null && user.password == null) {
                    if (body.username == null || body.password == null) {
                        return errorOutputs(400, new Error('Please provide both username and password or omit both.'), reply)

                    }
                } else {
                    if (body.password != null) {
                        const bcrypt = require('bcrypt')
                        body.password = await bcrypt.hash(body.password, 10)
                    }
                }

                const res = await User.findByIdAndUpdate(userId, body, { new: true })
                return successOutputs(res)

            } catch (error) {
                return errorOutputs(500, error, reply)
            }
        }
    )

    fastify.delete(
        '/users/:userId',
        {
            schema: {
                response: {
                    '4xx': { $ref: '4xxSerializer#' }
                }
            }  
        },
        async (request, reply) => {
            try {
                const userId = request.params.userId
                const res = await User.findByIdAndRemove(userId)

                if (res == null) {
                    throw new Error('Document not found')
                }

                return successOutputs(res)

            } catch (error) {
                return errorOutputs(500, error, reply)
            }
        }
    )
}

module.exports = routes