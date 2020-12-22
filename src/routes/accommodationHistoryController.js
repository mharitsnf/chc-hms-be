const AccommodationHistory = require("../models/accommodationHistoryModel")
const { successOutputs, errorOutputs } = require("../outputs/outputs")

const routes = async (fastify, options) => {
    fastify.get(
        '/accommodation_histories',
        {
            preValidation: [fastify.authenticate, (request, reply, done) => {
                if (request.query.checkInDateTime != null) {
                    request.query.checkInDateTime = new Date(request.query.checkInDateTime)
                }
                if (request.query.checkOutDateTime != null) {
                    request.query.checkOutDateTime = new Date(request.query.checkOutDateTime)
                }
                done()
            }],
            schema: {
                query: { $ref: 'AccommodationHistoryQuery#' },
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
        async (request, reply) => {
            try {
                let query = {}
                if (request.query.accommodation) query.accommodation = request.query.accommodation
                if (request.query.customer) query.customer = request.query.customer
                if (request.query.checkInDateTime) query.checkInDateTime = { $gt: request.query.checkInDateTime }
                if (request.query.checkOutDateTime) query.checkOutDateTime = { $lt: request.query.checkOutDateTime }

                const accommodationHistories = await AccommodationHistory.find(query).populate('accommodation').populate('customer')

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
            preValidation: [fastify.authenticate, (request, reply, done) => {
                try {
                    if (request.body.checkInDateTime != null) {
                        request.body.checkInDateTime = new Date(request.body.checkInDateTime)
                    }
                    if (request.body.checkOutDateTime != null) {
                        request.body.checkOutDateTime = new Date(request.body.checkOutDateTime)
                    }
                    done()
                } catch (error) {
                    reply
                    .code(500)
                    .send({
                        statusCode: 500,
                        message: error.message ? error.message : 'No message provided',
                        detail: error
                    })

                    done()
                }
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
                let searchRes = await AccommodationHistory.find({
                    accommodation: request.body.accommodation,
                    checkInDateTime: { $lt: request.body.checkOutDateTime },
                    checkOutDateTime: { $gt: request.body.checkInDateTime }
                })

                if (searchRes.length > 0) {
                    return errorOutputs(500, new Error('Accommodation has been occupied'), reply)
                }

                const accommodationHistory = new AccommodationHistory(request.body)
                const newAccHistory = await accommodationHistory.save()
                return successOutputs(await AccommodationHistory.findById(newAccHistory._id).populate('accommodation').populate('customer'))

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