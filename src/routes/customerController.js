const Customer = require("../models/customerModel")
const AccommodationHistory = require("../models/accommodationHistoryModel")
const Accommodation = require("../models/accommodationModel")
const AccommodationCategory = require("../models/accommodationCategoryModel")
const mongoose = require('mongoose')
const { successOutputs, errorOutputs } = require("../outputs/outputs")

const routes = async (fastify, options) => {
    fastify.get(
        '/customers',
        {
            preValidation: [fastify.authenticate],
            schema: {
                query: { $ref: 'CustomerQuery#' },
                response: {
                    '2xx': {
                        type: 'object',
                        properties: {
                            statusCode: { type: 'number' },
                            message: { type: 'string' },
                            data: {
                                type: 'array',
                                items: { $ref: 'CustomerSerializer#' }
                            }
                        }
                    }
                }
            }
        },
        async (request, reply) => {
            try {
                let query = {}
                if (request.query.customerType) query.customerType = request.query.customerType
                if (request.query.picName) query['picData.picName'] = { $regex: `.*${request.query.picName}.*`, $options: 'i' }
                if (request.query.picTelp) query['picData.picTelp'] = { $regex: `.*${request.query.picTelp}.*`, $options: 'i' }
                if (request.query.picEmail) query['picData.picEmail'] = { $regex: `.*${request.query.picEmail}.*`, $options: 'i' }
                if (request.query.picAddress) query['picData.picAddress'] = { $regex: `.*${request.query.picAddress}.*`, $options: 'i' }
                if (request.query.companyName) query['picData.companyName'] = { $regex: `.*${request.query.companyName}.*`, $options: 'i' }
                if (request.query.companyTelp) query['picData.companyTelp'] = { $regex: `.*${request.query.companyTelp}.*`, $options: 'i' }
                if (request.query.companyEmail) query['picData.companyEmail'] = { $regex: `.*${request.query.companyEmail}.*`, $options: 'i' }
                if (request.query.companyAddress) query['picData.companyAddress'] = { $regex: `.*${request.query.companyAddress}.*`, $options: 'i' }

                const customers = await Customer.find(query)
                return successOutputs(customers)
                
            } catch (error) {
                return errorOutputs(500, error, reply)
            }
        }
    )

    fastify.get(
        '/customers/:customerId',
        {
            preValidation: [fastify.authenticate],
            schema: {
                response: {
                    '2xx': {
                        type: 'object',
                        properties: {
                            statusCode: { type: 'number' },
                            message: { type: 'string' },
                            data: { $ref: 'CustomerSerializer#' }
                        }
                    }
                }
            }
        },
        async (request, reply) => {
            try {
                const customerId = request.params.customerId
                const customer = await Customer.findById(customerId)
                return successOutputs(customer)

            } catch (error) {
                return errorOutputs(500, error, reply)
            }
        }
    )

    fastify.get(
        '/customers/:customerId/histories',
        {
            preValidation: [fastify.authenticate],
            schema: {
                response: {
                    '2xx': {
                        type: 'object',
                        properties: {
                            statusCode: { type: 'number' },
                            message: { type: 'string' },
                            data: { $ref: 'CustomerHistorySerializer#' }
                        }
                    }
                }
            }
        },
        async (request, reply) => {
            try {
                const customerId = request.params.customerId
                const res = await Customer.aggregate([
                    {
                        $match: {
                            '_id': mongoose.Types.ObjectId(customerId)
                        }
                    },
                    {
                        $lookup: {
                            from: AccommodationHistory.collection.name,
                            localField: '_id',
                            foreignField: 'customer',
                            as: 'histories'
                        }
                    },
                    {
                        $unwind: '$histories'
                    },
                    {
                        $lookup: {
                            from: Accommodation.collection.name,
                            localField: 'histories.accommodation',
                            foreignField: '_id',
                            as: 'histories.accommodation'
                        }
                    },
                    {
                        $addFields: {
                            'histories.accommodation': { $arrayElemAt: ['$histories.accommodation', 0] }
                        }
                    },
                    {
                        $lookup: {
                            from: AccommodationCategory.collection.name,
                            localField: 'histories.accommodation.category',
                            foreignField: '_id',
                            as: 'histories.accommodation.category'
                        }
                    },
                    {
                        $addFields: {
                            'histories.accommodation.category': { $arrayElemAt: ['$histories.accommodation.category', 0] }
                        }
                    },
                    {
                        $group: {
                            _id: {
                                _id: '$_id',
                                customerType: '$customerType',
                                picData: '$picData',
                                companyData: '$companyData',
                            },
                            histories: {
                                $push: {
                                    accommodation: '$histories.accommodation',
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
                console.log(util.inspect(res, false, null, true))
                return successOutputs(res[0] == undefined ? {} : res[0])

            } catch (error) {
                return errorOutputs(500, error, reply)
            }
        }
    )

    fastify.post(
        '/customers',
        {
            preValidation: [fastify.authenticate],
            schema: {
                body: { $ref: 'CustomerBody#' },
                response: {
                    '2xx': {
                        type: 'object',
                        properties: {
                            statusCode: { type: 'number' },
                            message: { type: 'string' },
                            data: { $ref: 'CustomerSerializer#' }
                        }
                    }
                }
            }
        },
        async (request, reply) => {
            try {
                const customer = new Customer(request.body)
                const res = await customer.save()
                return successOutputs(res)

            } catch (error) {
                return errorOutputs(500, error, reply)
            }
        }
    )

    fastify.put(
        '/customers/:customerId',
        {
            preValidation: [fastify.authenticate],
            schema: {
                body: { $ref: 'CustomerBody#' },
                response: {
                    '2xx': {
                        type: 'object',
                        properties: {
                            statusCode: { type: 'number' },
                            message: { type: 'string' },
                            data: { $ref: 'CustomerSerializer#' }
                        }
                    }
                }
            }
        },
        async (request, reply) => {
            try {
                const customerId = request.params.customerId
                const customer = await Customer.findById(customerId)
                const body = request.body

                const picData = Object.assign(customer._doc.picData, body.picData)
                const companyData = Object.assign(customer._doc.companyData, body.companyData)

                body.picData = picData
                body.companyData = companyData

                const res = await Customer.findByIdAndUpdate(customerId, body, { new: true })
                return successOutputs(res)

            } catch (error) {
                return errorOutputs(500, error, reply)
            }
        }
    )

    fastify.delete(
        '/customers/:customerId',
        {
            preValidation: [fastify.authenticate],
            schema: {
                response: {
                    '2xx': {
                        type: 'object',
                        properties: {
                            statusCode: { type: 'number' },
                            message: { type: 'string' },
                            data: { $ref: 'CustomerSerializer#' }
                        }
                    }
                }
            }
        },
        async (request, reply) => {
            try {
                const customerId = request.params.customerId
                const res = await Customer.findByIdAndRemove(customerId)

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