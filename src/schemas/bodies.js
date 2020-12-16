
module.exports = ({ fastify }) => {
    // Division body schema
    fastify.addSchema({
        $id: 'DivisionBody',
        type: 'object',
        required: ['divisionName'],
        properties: {
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

    // Level body schema
    fastify.addSchema({
        $id: 'LevelBody',
        type: 'object',
        required: ['levelName'],
        properties: {
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

    // User body schema
    fastify.addSchema({
        $id: 'UserBody',
        type: 'object',
        properties: {
            fullname: { type:  'string' },
            nickname: { type:  'string' },
            KIP: { type:  'string' },
            username: { type:  'string' },
            password: { type:  'string', minLength: 6 },
            email: { type:  'string' },
            division: { $ref: 'DivisionBody#' },
            level: { $ref: 'LevelBody#' }
        }
    })
}