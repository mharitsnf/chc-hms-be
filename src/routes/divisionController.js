const Division = require("../models/divisionModel")
const { successOutputs, errorOutputs } = require("../outputs/outputs")

const routes = async (fastify, options) => {
    fastify.get(
        '/divisions',
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
        '/divisions/:division_id',
        async (request, reply) => {
            try {
                const division_id = request.params.division_id
                const division = await Division.findById(division_id)
                return successOutputs(division)

            } catch (error) {
                return errorOutputs(500, error, reply)
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
                return successOutputs(res)

            } catch (error) {
                return errorOutputs(500, error, reply)
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
                const body = request.body
                const res = await Division.findByIdAndUpdate(division_id, body, { new: true })
                return successOutputs(res)

            } catch (error) {
                return errorOutputs(500, error, reply)
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

                return successOutputs(res)

            } catch (error) {
                return errorOutputs(500, error, reply)
            }
        }
    )
}

module.exports = routes