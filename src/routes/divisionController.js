const Division = require("../models/divisionModel")
const { successOutputs, errorOutputs } = require("../outputs/outputs")

const routes = async (fastify, options) => {
    fastify.get(
        '/divisions',
        {
            preValidation: [fastify.authenticate],
            schema: {
                response: {
                    '2xx': {
                        type: 'object',
                        properties: {
                            statusCode: { type: 'number' },
                            message: { type: 'string' },
                            data: {
                                type: 'array',
                                items: { $ref: 'DivisionSerializer#' }
                            }
                        }
                    }
                }
            }
        },
        async (_request, reply) => {
            try {
                const divisions = await Division.find()
                return successOutputs(divisions)
                
            } catch (error) {
                return errorOutputs(500, error, reply)
            }
        }
    )

    fastify.get(
        '/divisions/:divisionId',
        {
            preValidation: [fastify.authenticate],
            schema: {
                response: {
                    '2xx': {
                        type: 'object',
                        properties: {
                            statusCode: { type: 'number' },
                            message: { type: 'string' },
                            data: { $ref: 'DivisionSerializer#' }
                        }
                    }
                }
            }
        },
        async (request, reply) => {
            try {
                const divisionId = request.params.divisionId
                const division = await Division.findById(divisionId)
                return successOutputs(division)

            } catch (error) {
                return errorOutputs(500, error, reply)
            }
        }
    )

    fastify.post(
        '/divisions',
        {
            preValidation: [fastify.authenticate],
            schema: {
                body: { $ref: 'DivisionBody#' },
                response: {
                    '2xx': {
                        type: 'object',
                        properties: {
                            statusCode: { type: 'number' },
                            message: { type: 'string' },
                            data: { $ref: 'DivisionSerializer#' }
                        }
                    }
                }
            }
        },
        async (request, reply) => {
            try {
                const division = new Division(request.body)
                const res = await division.save()
                return successOutputs(res)

            } catch (error) {
                return errorOutputs(500, error, reply)
            }
        }
    )

    fastify.put(
        '/divisions/:divisionId',
        {
            preValidation: [fastify.authenticate],
            schema: {
                body: { $ref: 'DivisionBody#' },
                response: {
                    '2xx': {
                        type: 'object',
                        properties: {
                            statusCode: { type: 'number' },
                            message: { type: 'string' },
                            data: { $ref: 'DivisionSerializer#' }
                        }
                    }
                }
            }
        },
        async (request, reply) => {
            try {
                const divisionId = request.params.divisionId
                const body = request.body
                const res = await Division.findByIdAndUpdate(divisionId, body, { new: true })
                return successOutputs(res)

            } catch (error) {
                return errorOutputs(500, error, reply)
            }
        }
    )

    fastify.delete(
        '/divisions/:divisionId',
        {
            preValidation: [fastify.authenticate],
            schema: {
                response: {
                    '2xx': {
                        type: 'object',
                        properties: {
                            statusCode: { type: 'number' },
                            message: { type: 'string' },
                            data: { $ref: 'DivisionSerializer#' }
                        }
                    }
                }
            }
        },
        async (request, reply) => {
            try {
                const divisionId = request.params.divisionId
                const res = await Division.findByIdAndRemove(divisionId)

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