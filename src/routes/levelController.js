const Level = require("../models/levelModel")
const { successOutputs, errorOutputs } = require("../outputs/outputs")

const routes = async (fastify, options) => {
    fastify.get(
        '/levels',
        {
            schema: {
                response: {
                    '2xx': {
                        type: 'object',
                        properties: {
                            statusCode: { type: 'number' },
                            message: { type: 'string' },
                            data: {
                                type: 'array',
                                items: { $ref: 'LevelSerializer#' }
                            }
                        }
                    }
                }
            }
        },
        async (_request, reply) => {
            try {
                const levels = await Level.find()
                return successOutputs(levels)
                
            } catch (error) {
                return errorOutputs(500, error, reply)
            }
        }
    )

    fastify.get(
        '/levels/:levelId',
        {
            schema: {
                response: {
                    '2xx': {
                        type: 'object',
                        properties: {
                            statusCode: { type: 'number' },
                            message: { type: 'string' },
                            data: { $ref: 'LevelSerializer#' }
                        }
                    }
                }
            }
        },
        async (request, reply) => {
            try {
                const levelId = request.params.levelId
                const division = await Level.findById(levelId)
                return successOutputs(division)

            } catch (error) {
                return errorOutputs(500, error, reply)
            }
        }
    )

    fastify.post(
        '/levels',
        {
            schema: {
                body: { $ref: 'LevelBody#' },
                response: {
                    '2xx': {
                        type: 'object',
                        properties: {
                            statusCode: { type: 'number' },
                            message: { type: 'string' },
                            data: { $ref: 'LevelSerializer#' }
                        }
                    }
                }
            }
        },
        async (request, reply) => {
            try {
                const user = new Level(request.body)
                const res = await user.save()
                return successOutputs(res)

            } catch (error) {
                return errorOutputs(500, error, reply)
            }
        }
    )

    fastify.put(
        '/levels/:levelId',
        {
            schema: {
                body: { $ref: 'LevelBody#' },
                response: {
                    '2xx': {
                        type: 'object',
                        properties: {
                            statusCode: { type: 'number' },
                            message: { type: 'string' },
                            data: { $ref: 'LevelSerializer#' }
                        }
                    }
                }
            }
        },
        async (request, reply) => {
            try {
                const levelId = request.params.levelId
                const body = request.body
                const res = await Level.findByIdAndUpdate(levelId, body, { new: true })
                return successOutputs(res)

            } catch (error) {
                return errorOutputs(500, error, reply)
            }
        }
    )

    fastify.delete(
        '/levels/:levelId',
        {
            schema: {
                response: {
                    '2xx': {
                        type: 'object',
                        properties: {
                            statusCode: { type: 'number' },
                            message: { type: 'string' },
                            data: { $ref: 'LevelSerializer#' }
                        }
                    }
                }
            }
        },
        async (request, reply) => {
            try {
                const levelId = request.params.levelId
                const res = await Level.findByIdAndRemove(levelId)

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