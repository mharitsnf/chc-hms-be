
const schema = {
    response: {
        '200': {
            type: "object",
            properties: {
                hello: { type: 'string' }
            }
        }
    }
}

const routes = async (fastify, options) => {
    fastify.get('/', { schema }, async (request, reply) => {
        return { hello: "world", test: "ashu", test2: "ga lulus sensor" }
    })
}

module.exports = routes