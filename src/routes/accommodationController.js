const Accommodation = require("../models/accommodationModel")
const { successOutputs, errorOutputs } = require("../outputs/outputs")


const routes = async (fastify, options) => {
    fastify.get(
        '/accommodations',
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
                                items: { $ref: 'AccommodationSerializer#' }
                            }
                        }
                    }
                }
            }
        },
        async (_request, reply) => {
            try {
                const accommodations = await Accommodation.find().populate('category')
                return successOutputs(accommodations)
                
            } catch (error) {
                return errorOutputs(500, error, reply)
            }
        }
    )

    fastify.get(
        '/accommodations/:accommodationId',
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
                            data: { $ref: 'AccommodationSerializer#' }
                        }
                    }
                }
            }  
        },
        async (request, reply) => {
            try {
                const accommodationId = request.params.accommodationId
                const accommodation = await Accommodation.findById(accommodationId).populate('category')
                return successOutputs(accommodation)

            } catch (error) {
                return errorOutputs(500, error, reply)
            }
        }
    )

    fastify.post(
        '/accommodations',
        {
            preValidation: [fastify.authenticate],
            schema: {
                body: { $ref: 'AccommodationBody#' },
                response: {
                    '2xx': {
                        type: 'object',
                        properties: {
                            statusCode: { type: 'number' },
                            message: { type: 'string' },
                            data: { $ref: 'AccommodationSerializer#' }
                        }
                    }
                }
            }
        },
        async (request, reply) => {
            try {
                const accommodation = new Accommodation(request.body)
                const res = await accommodation.save()
                return successOutputs(res)

            } catch (error) {
                return errorOutputs(500, error, reply)
            }
        }
    )

    fastify.put(
        '/accommodations/:accommodationId',
        {
            preValidation: [fastify.authenticate],
            schema: {
                body: { $ref: 'AccommodationBody#' },
                response: {
                    '2xx': {
                        type: 'object',
                        properties: {
                            statusCode: { type: 'number' },
                            message: { type: 'string' },
                            data: { $ref: 'AccommodationSerializer#' }
                        }
                    }
                }
            }
        },
        async (request, reply) => {
            try {
                const accommodationId = request.params.accommodationId
                const body = request.body
                const res = await Accommodation.findByIdAndUpdate(accommodationId, body, { new: true })
                return successOutputs(res)

            } catch (error) {
                return errorOutputs(500, error, reply)
            }
        }
    )

    fastify.delete(
        '/accommodations/:accommodationId',
        {
            preValidation: [fastify.authenticate],
            schema: {
                response: {
                    '2xx': {
                        type: 'object',
                        properties: {
                            statusCode: { type: 'number' },
                            message: { type: 'string' },
                            data: { $ref: 'AccommodationSerializer#' }
                        }
                    }
                }
            }
        },
        async (request, reply) => {
            try {
                const accommodationId = request.params.accommodationId
                const res = await Accommodation.findByIdAndRemove(accommodationId)

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