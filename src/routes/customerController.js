const Customer = require("../models/customerModel")
const { successOutputs, errorOutputs } = require("../outputs/outputs")

const routes = async (fastify, options) => {
    fastify.get(
        '/customers',
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
                                items: { $ref: 'CustomerSerializer#' }
                            }
                        }
                    }
                }
            }
        },
        async (_request, reply) => {
            try {
                const customers = await Customer.find()
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