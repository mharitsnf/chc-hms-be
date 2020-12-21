const AccommodationCategory = require("../models/accommodationCategoryModel")
const { successOutputs, errorOutputs } = require("../outputs/outputs")


const routes = async (fastify, options) => {
    fastify.get(
        '/accommodation_categories',
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
                            data: {
                                type: 'array',
                                items: { $ref: 'AccommodationCategorySerializer#' }
                            }
                        }
                    }
                }
            }
        },
        async (_request, reply) => {
            try {
                const accommodationCategories = await AccommodationCategory.find()
                return successOutputs(accommodationCategories)
                
            } catch (error) {
                return errorOutputs(500, error, reply)
            }
        }
    )

    fastify.get(
        '/accommodation_categories/:accommodationCategoryId',
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
                            data: { $ref: 'AccommodationCategorySerializer#' }
                        }
                    }
                }
            }  
        },
        async (request, reply) => {
            try {
                const accommodationCategoryId = request.params.accommodationCategoryId
                const accommodationCategory = await AccommodationCategory.findById(accommodationCategoryId)
                return successOutputs(accommodationCategory)

            } catch (error) {
                return errorOutputs(500, error, reply)
            }
        }
    )

    fastify.post(
        '/accommodation_categories',
        {
            preValidation: [fastify.authenticate],
            schema: {
                body: { $ref: 'AccommodationCategoryBody#' },
                response: {
                    '4xx': { $ref: '4xxSerializer#' },
                    '2xx': {
                        type: 'object',
                        properties: {
                            statusCode: { type: 'number' },
                            message: { type: 'string' },
                            data: { $ref: 'AccommodationCategorySerializer#' }
                        }
                    }
                }
            }
        },
        async (request, reply) => {
            try {
                const accommodationCategory = new AccommodationCategory(request.body)
                const res = await accommodationCategory.save()
                return successOutputs(res)

            } catch (error) {
                return errorOutputs(500, error, reply)
            }
        }
    )

    fastify.put(
        '/accommodation_categories/:accommodationCategoryId',
        {
            preValidation: [fastify.authenticate],
            schema: {
                body: { $ref: 'AccommodationCategoryBody#' },
                response: {
                    '4xx': { $ref: '4xxSerializer#' },
                    '2xx': {
                        type: 'object',
                        properties: {
                            statusCode: { type: 'number' },
                            message: { type: 'string' },
                            data: { $ref: 'AccommodationCategorySerializer#' }
                        }
                    }
                }
            }
        },
        async (request, reply) => {
            try {
                const accommodationCategoryId = request.params.accommodationCategoryId
                const body = request.body
                const res = await AccommodationCategory.findByIdAndUpdate(accommodationCategoryId, body, { new: true })
                return successOutputs(res)

            } catch (error) {
                return errorOutputs(500, error, reply)
            }
        }
    )

    fastify.delete(
        '/accommodation_categories/:accommodationCategoryId',
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
                            data: { $ref: 'AccommodationCategorySerializer#' }
                        }
                    }
                }
            }
        },
        async (request, reply) => {
            try {
                const accommodationCategoryId = request.params.accommodationCategoryId
                const res = await AccommodationCategory.findByIdAndRemove(accommodationCategoryId)

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