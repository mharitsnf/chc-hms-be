const { default: fastify } = require("fastify")

module.exports = ({ fastify }) => {
    fastify.addSchema({
        $id: '4xxSerializer',
        type: 'object',
        properties: {
            statusCode: { type: 'number' },
            message: { type: 'string' }
        }
    })
}