const User = require("../models/userModel")
const { successOutputs, errorOutputs } = require("../outputs/outputs")

const routes = async (fastify, options) => {
    fastify.get(
        '/users',
        {
            preValidation: [fastify.authenticate],
            schema: {
                query: { $ref: 'UserQuery#' },
                response: {
                    '4xx': { $ref: '4xxSerializer#' },
                    '2xx': {
                        type: 'object',
                        properties: {
                            statusCode: { type: 'number' },
                            message: { type: 'string' },
                            data: {
                                type: 'array',
                                items: { $ref: 'UserSerializer#' }
                            }
                        }
                    }
                }
            }  
        },
        async (request, reply) => {
            try {
                let query = {}
                if (request.query.fullname) query.fullname = { $regex: `.*${request.query.fullname}.*` }
                if (request.query.nickname) query.nickname = { $regex: `.*${request.query.nickname}.*` }
                if (request.query.KIP) query.KIP = { $regex: `.*${request.query.KIP}.*` }
                if (request.query.email) query.email = { $regex: `.*${request.query.email}.*` }
                if (request.query.username) query.username = { $regex: `.*${request.query.username}.*` }
                if (request.query.division) query.division = request.query.division
                if (request.query.level) query.level = request.query.level

                console.log(query)

                const users = await User.find(query).populate('level').populate('division')
                return successOutputs(users)

            } catch (error) {
                return errorOutputs(500, error, reply)
            }
        }
    )

    fastify.get(
        '/users/:userId',
        {
            preValidation: [fastify.authenticate],
            schema: {
                response: {
                    '4xx': { $ref: '4xxSerializer#' },
                    '2xx': {
                        type: 'object',
                        properties: {
                            statusCode: { type: 'number' },
                            message: { type: 'string' },
                            data: { $ref: 'UserSerializer#' }
                        }
                    }
                }
            }  
        },
        async (request, reply) => {
            try {
                const userId = request.params.userId
                const user = await User.findById(userId).populate('level').populate('division')
                return successOutputs(user)

            } catch (error) {
                return errorOutputs(500, error, reply)
            }
        }
    )

    fastify.post(
        '/users',
        {
            preValidation: [fastify.authenticate],
            schema: {
                body: { $ref: 'UserBody#' },
                response: {
                    '4xx': { $ref: '4xxSerializer#' },
                    '2xx': {
                        type: 'object',
                        properties: {
                            statusCode: { type: 'number' },
                            message: { type: 'string' },
                            data: { $ref: 'UserSerializer#' }
                            
                        }
                    }
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
            preValidation: [fastify.authenticate],
            schema: {
                body: { $ref: 'UserBody#' },
                response: {
                    '4xx': { $ref: '4xxSerializer#' },
                    '2xx': {
                        type: 'object',
                        properties: {
                            statusCode: { type: 'number' },
                            message: { type: 'string' },
                            data: { $ref: 'UserSerializer#' }
                            
                        }
                    }
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
            preValidation: [fastify.authenticate],
            schema: {
                response: {
                    '4xx': { $ref: '4xxSerializer#' },
                    '2xx': {
                        type: 'object',
                        properties: {
                            statusCode: { type: 'number' },
                            message: { type: 'string' },
                            data: { $ref: 'UserSerializer#' }
                            
                        }
                    }
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