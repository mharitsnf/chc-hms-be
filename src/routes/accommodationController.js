const Accommodation = require("../models/accommodationModel")
const AccommodationHistory = require("../models/accommodationHistoryModel")
const AccommodationCategory = require('../models/accommodationCategoryModel')
const Customer = require("../models/customerModel")
const mongoose = require('mongoose')
const { successOutputs, errorOutputs } = require("../outputs/outputs")


const routes = async (fastify, options) => {
    fastify.get(
        '/accommodations',
        {
            preValidation: [fastify.authenticate],
            schema: {
                query: { $ref: 'AccommodationQuery#' },
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
        async (request, reply) => {
            try {
                let query = {}
                if (request.query.name) query.name = { $regex: `.*${request.query.name}.*`, $options: 'i' }
                if (request.query.location) query.location = { $regex: `.*${request.query.location}.*`, $options: 'i' }
                if (request.query.defaultCapacity) query.defaultCapacity = { $gte: request.query.defaultCapacity }
                if (request.query.maxCapacity) query.maxCapacity = { $lte: request.query.maxCapacity }
                if (request.query.category) query.category = mongoose.Types.ObjectId(request.query.category) 

                const accommodations = await Accommodation.find(query).populate('category')
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

    fastify.get(
        '/accommodations/:accommodationId/history',
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
                            data: { $ref: 'AccommodationHistoryDetailSerializer#' }
                        }
                    }
                }
            }  
        },
        async (request, reply) => {
            try {
                const accommodationId = request.params.accommodationId
                const res = await Accommodation.aggregate([
                    {
                        $match: {
                            '_id': mongoose.Types.ObjectId(accommodationId)
                        }
                    },
                    {
                        $lookup: {
                            from: AccommodationHistory.collection.name,
                            localField: '_id',
                            foreignField: 'accommodation',
                            as: 'histories'
                        }
                    },
                    {
                        $lookup: {
                            from: AccommodationCategory.collection.name,
                            localField: 'category',
                            foreignField: '_id',
                            as: 'category'
                        }
                    },
                    {
                        $unwind: '$histories'
                    },
                    {
                        $lookup: {
                            from: Customer.collection.name,
                            localField: 'histories.customer',
                            foreignField: '_id',
                            as: 'histories.customer'
                        }
                    },
                    {
                        $group: {
                            _id: {
                                _id: '$_id',
                                name: '$name',
                                location: '$location',
                                defaultCapacity: '$defaultCapacity',
                                maxCapacity: '$maxCapacity',
                                category: '$category',
                            },
                            histories: {
                                $push: {
                                    customer: { $arrayElemAt: ['$histories.customer', 0] },
                                    checkInDateTime: '$histories.checkInDateTime',
                                    checkOutDateTime: '$histories.checkOutDateTime',
                                    status: '$histories.status',
                                }
                            }
                        }
                    },
                    {
                        $project: {
                            histories: 1
                        }
                    }
                ])
                const util = require('util')
                console.log(util.inspect(res[0], false, null, true))
                return successOutputs(res[0] == undefined ? {} : res[0])

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