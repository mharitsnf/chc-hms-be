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
                const accommodationHistories = await AccommodationHistory.find()
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
                const accommodationHistory = await AccommodationHistory.findById(accommodationHistoryId)
                return successOutputs(accommodationHistory)

            } catch (error) {
                return errorOutputs(500, error, reply)
            }
        }
    )

    fastify.post(
        '/accommodation_histories',
        {
            preValidation: [fastify.authenticate],
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
                return successOutputs(res)

            } catch (error) {
                return errorOutputs(500, error, reply)
            }
        }
    )

    fastify.put(
        '/accommodation_histories/:accommodationHistoryId',
        {
            preValidation: [fastify.authenticate],
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
                const accommodationHistory = await AccommodationHistory.findById(accommodationHistoryId)
                const body = request.body

                const picData = Object.assign(accommodationHistory._doc.picData, body.picData)
                const companyData = Object.assign(accommodationHistory._doc.companyData, body.companyData)

                body.picData = picData
                body.companyData = companyData

                const res = await AccommodationHistory.findByIdAndUpdate(accommodationHistoryId, body, { new: true })
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
                const res = await AccommodationHistory.findByIdAndRemove(accommodationHistoryId)

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