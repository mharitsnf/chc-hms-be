const AccommodationHistory = require("../models/accommodationHistoryModel")
const { successOutputs, errorOutputs } = require("../outputs/outputs")

const routes = async (fastify, options) => {
    fastify.get(
        '/accommodation_histories',
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
                                items: { $ref: 'AccommodationHistorySerializer#' }
                            }
                        }
                    }
                }
            }
        },
        async (_request, reply) => {
            try {
                const accommodationHistories = await AccommodationHistory.find().populate('accommodation').populate('customer')
                return successOutputs(accommodationHistories)
                
            } catch (error) {
                return errorOutputs(500, error, reply)
            }
        }
    )

    fastify.get(
        '/accommodation_histories/:accommodationHistoryId',
        {
            preValidation: [fastify.authenticate],
            schema: {
                response: {
                    '2xx': {
                        type: 'object',
                        properties: {
                            statusCode: { type: 'number' },
                            message: { type: 'string' },
                            data: { $ref: 'AccommodationHistorySerializer#' }
                        }
                    }
                }
            }
        },
        async (request, reply) => {
            try {
                const accommodationHistoryId = request.params.accommodationHistoryId
                const accommodationHistory = await AccommodationHistory.findById(accommodationHistoryId).populate('accommodation').populate('customer')
                return successOutputs(accommodationHistory)

            } catch (error) {
                return errorOutputs(500, error, reply)
            }
        }
    )

    fastify.post(
        '/accommodation_histories',
        {
            preValidation: [fastify.authenticate, async (request, reply, done) => {
                if (request.body.checkInDateTime != null) {
                    request.body.checkInDateTime = new Date(request.body.checkInDateTime)
                }
                if (request.body.checkOutDateTime != null) {
                    request.body.checkOutDateTime = new Date(request.body.checkOutDateTime)
                }
                done()
            }],
            schema: {
                body: { $ref: 'AccommodationHistoryBody#' },
                response: {
                    '2xx': {
                        type: 'object',
                        properties: {
                            statusCode: { type: 'number' },
                            message: { type: 'string' },
                            data: { $ref: 'AccommodationHistorySerializer#' }
                        }
                    }
                }
            }
        },
        async (request, reply) => {
            try {
                const accommodationHistory = new AccommodationHistory(request.body)
                const res = await accommodationHistory.save()
                return successOutputs(await AccommodationHistory.findById(res._id).populate('accommodation').populate('customer'))

            } catch (error) {
                return errorOutputs(500, error, reply)
            }
        }
    )

    fastify.put(
        '/accommodation_histories/:accommodationHistoryId',
        {
            preValidation: [fastify.authenticate, (request, reply, done) => {
                if (request.body.checkInDateTime != null) {
                    request.body.checkInDateTime = new Date(request.body.checkInDateTime)
                }
                if (request.body.checkOutDateTime != null) {
                    request.body.checkOutDateTime = new Date(request.body.checkOutDateTime)
                }
                done()
            }],
            schema: {
                body: { $ref: 'AccommodationHistoryBody#' },
                response: {
                    '2xx': {
                        type: 'object',
                        properties: {
                            statusCode: { type: 'number' },
                            message: { type: 'string' },
                            data: { $ref: 'AccommodationHistorySerializer#' }
                        }
                    }
                }
            }
        },
        async (request, reply) => {
            try {
                const accommodationHistoryId = request.params.accommodationHistoryId
                const body = request.body
                const res = await AccommodationHistory.findByIdAndUpdate(accommodationHistoryId, body, { new: true }).populate('accommodation').populate('customer')
                return successOutputs(res)

            } catch (error) {
                return errorOutputs(500, error, reply)
            }
        }
    )

    fastify.delete(
        '/accommodation_histories/:accommodationHistoryId',
        {
            preValidation: [fastify.authenticate],
            schema: {
                response: {
                    '2xx': {
                        type: 'object',
                        properties: {
                            statusCode: { type: 'number' },
                            message: { type: 'string' },
                            data: { $ref: 'AccommodationHistorySerializer#' }
                        }
                    }
                }
            }
        },
        async (request, reply) => {
            try {
                const accommodationHistoryId = request.params.accommodationHistoryId
                const res = await AccommodationHistory.findByIdAndRemove(accommodationHistoryId).populate('accommodation').populate('customer')

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