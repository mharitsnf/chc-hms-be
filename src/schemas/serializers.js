
module.exports = ({ fastify }) => {
    // 4xx serializer schema
    fastify.addSchema({
        $id: '4xxSerializer',
        type: 'object',
        properties: {
            statusCode: { type: 'number' },
            message: { type: 'string' }
        }
    })

    // Division serializer schema
    fastify.addSchema({
        $id: 'DivisionSerializer',
        type: 'object',
        properties: {
            _id: { type: 'string' },
            divisionName: { type: 'string' },
            menuPermissions: {
                type: 'array',
                items: {
                    type: 'object',
                    properties: {
                        menuName: { type: 'string' },
                        permissible: { type: 'string' }
                    }
                }
            }
        }
    })

    // Level serializer schema
    fastify.addSchema({
        $id: 'LevelSerializer',
        type: 'object',
        properties: {
            _id: { type: 'string' },
            levelName: { type: 'string' },
            actionPermissions: {
                type: 'array',
                items: {
                    type: 'object',
                    properties: {
                        actionName: { type: 'string' },
                        permissible: { type: 'boolean' }
                    }
                }
            }
        }
    })

    // User serializer schema
    fastify.addSchema({
        $id: 'UserSerializer',
        type: 'object',
        properties: {
            _id: { type: 'string' },
            fullname: { type: 'string' },
            nickname: { type: 'string' },
            username: { type: 'string' },
            email: { type: 'string' },
            division: { $ref: 'DivisionSerializer#' },
            level: { $ref: 'LevelSerializer#' }
        }
    })
}