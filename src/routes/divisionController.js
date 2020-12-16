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
        '/divisions/:divisionId',
        async (request, reply) => {
            try {
                const divisionId = request.params.divisionId
                const division = await Division.findById(divisionId)
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
                    required: ['divisionName'],
                    properties: {
                        divisionName: { type: 'string' },
                        menuPermissions: { type: 'array' }
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
        '/divisions/:divisionId',
        {
            schema: {
                body: {
                    type: "object",
                    properties: {
                        divisionName: { type: 'string' },
                        menuPermissions: { type: 'array' }
                    }
                }
            }
        },
        async (request, reply) => {
            try {
                const divisionId = request.params.divisionId
                const body = request.body
                const res = await Division.findByIdAndUpdate(divisionId, body, { new: true })
                return successOutputs(res)

            } catch (error) {
                return errorOutputs(500, error, reply)
            }
        }
    )

    fastify.delete(
        '/divisions/:divisionId',
        async (request, reply) => {
            try {
                const divisionId = request.params.divisionId
                const res = await Division.findByIdAndRemove(divisionId)

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