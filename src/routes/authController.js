const { successOutputs, errorOutputs } = require("../outputs/outputs")
const User = require("../models/userModel")
const JWT = require('jsonwebtoken')
const bcrypt = require('bcrypt')

const routes = async (fastify, options) => {
    fastify.post(
        '/auth/token',
        {
            schema: {
                body: { $ref: 'AuthTokenBody#' },
                response: {
                    '2xx': {
                        type: 'object',
                        properties: {
                            statusCode: { type: 'number' },
                            message: { type: 'string' },
                            data: {
                                type: 'object',
                                properties: {
                                    token: { type: 'string' }
                                }
                            }
                        }
                    }
                }
            }
        },
        async (request, reply) => {
            try {
                const users = await User.find({ username: request.body.username })
                const user = users[0]
                
                const match = await bcrypt.compare(request.body.password, user.password)

                if (match) {
                    const token = JWT.sign({
                        _id: user._id,
                        fullname: user.fullname,
                        nickname: user.nickname
                    }, process.env.JWT_SECRET, { expiresIn: '1 day' })
                    return successOutputs({ token: token })
                } else {
                    throw new Error('Error authenticating.')
                }

            } catch (error) {
                return errorOutputs(500, error, reply)
            }
        }
    )   

    fastify.post(
        '/auth/verify',
        {
            schema: {
                body: { $ref: 'AuthVerifyBody#' },
                response: {
                    '2xx': {
                        type: 'object',
                        properties: {
                            statusCode: { type: 'number' },
                            message: { type: 'string' },
                            data: {
                                type: 'object',
                                properties: {
                                    _id: { type: 'string' },
                                    fullname: { type: 'string' },
                                    iat: { type: 'number' },
                                    exp: { type: 'number' },
                                }
                            }
                        }
                    }
                }
            }
        },
        async (request, reply) => {
            try {
                let decoded = JWT.verify(request.body.token, process.env.JWT_SECRET)
                return successOutputs({
                    "_id" : decoded._id,
                    fullname : decoded.fullname,
                    iat: decoded.iat,
                    exp: decoded.exp
                })
            } catch (error) {
                return errorOutputs(500, error, reply)
            }
        }
    )
}

module.exports = routes