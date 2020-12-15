const Division = require("../models/divisionModel")

const routes = async (fastify, options) => {
    fastify.get(
        '/divisions',
        async (_request, reply) => {
            try {
                const divisions = await Division.find()
                return {
                    statusCode: 200,
                    message: "Successful",
                    data: divisions
                }          
            } catch (error) {
                reply.code(500)
                return {
                    statusCode: 500,
                    error: "Internal Server Error",
                    message: error.message ? error.message : 'No message provided',
                    details: error
                }
            }
        }
    )

    fastify.get(
        '/divisions/:division_id',
        async (request, reply) => {
            try {
                const division_id = request.params.division_id
                const user = await Division.findById(division_id)
                return {
                    statusCode: 200,
                    message: "Successful",
                    data: user
                }
            } catch (error) {
                reply.code(500)
                return {
                    statusCode: 500,
                    error: "Internal Server Error",
                    message: error.message ? error.message : 'No message provided',
                    details: error
                }
            }
        }
    )

    fastify.post(
        '/divisions',
        {
            schema: {
                body: {
                    type: "object",
                    required: ['division_name'],
                    properties: {
                        division_name: { type: 'string' },
                        menu_permission: { type: 'array' }
                    }
                }
            }
        },
        async (request, reply) => {
            try {
                const user = new Division(request.body)
                const res = await user.save()
                return {
                    statusCode: 200,
                    message: "Successful",
                    data: res
                }
            } catch (error) {
                reply.code(500)
                return {
                    statusCode: 500,
                    error: "Internal Server Error",
                    message: error.message ? error.message : 'No message provided',
                    details: error
                }
            }
        }
    )

    fastify.put(
        '/divisions/:division_id',
        {
            schema: {
                body: {
                    type: "object",
                    properties: {
                        division_name: { type: 'string' },
                        menu_permission: { type: 'array' }
                    }
                }
            }
        },
        async (request, reply) => {
            try {
                const division_id = request.params.division_id
                const user = request.body
                const { ...updateData } = user
                const res = await Division.findByIdAndUpdate(division_id, updateData, { new: true })
                return {
                    statusCode: 200,
                    message: "Successful",
                    data: res
                }
            } catch (error) {
                reply.code(500)
                return {
                    statusCode: 500,
                    error: "Internal Server Error",
                    message: error.message ? error.message : 'No message provided',
                    details: error
                }
            }
        }
    )

    fastify.delete(
        '/divisions/:division_id',
        async (request, reply) => {
            try {
                const division_id = request.params.division_id
                const res = await Division.findByIdAndRemove(division_id)

                if (res == null) {
                    throw new Error('Document not found')
                }

                return {
                    statusCode: 200,
                    message: "Successful",
                    data: res
                }
            } catch (error) {
                reply.code(500)
                return {
                    statusCode: 500,
                    error: "Internal Server Error",
                    message: error.message ? error.message : 'No message provided',
                    details: error
                }
            }
        }
    )
}

module.exports = routes