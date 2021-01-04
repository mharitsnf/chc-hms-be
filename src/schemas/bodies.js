
module.exports = ({ fastify }) => {

    // Auth token body schema
    fastify.addSchema({
        $id: 'AuthTokenBody',
        type: 'object',
        properties: {
            username: { type: 'string' },
            password: { type: 'string', minLength: 6 }
        }
    })

    // Auth verify body schema
    fastify.addSchema({
        $id: 'AuthVerifyBody',
        type: 'object',
        properties: {
            token: { type: 'string' },
        }
    })

    // Division body schema
    fastify.addSchema({
        $id: 'DivisionBody',
        type: 'object',
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
            division: { type: 'string' },
            level: { type: 'string' }
        }
    })

    // Accommodation Category body schema
    fastify.addSchema({
        $id: 'AccommodationCategoryBody',
        type: 'object',
        properties: {
            name: { type:  'string' }
        }
    })

    // Accommodation body schema
    fastify.addSchema({
        $id: 'AccommodationBody',
        type: 'object',
        properties: {
            name: { type:  'string' },
            location: { type:  'string' },
            defaultCapacity: { type:  'number' },
            maxCapacity: { type:  'number' },
            category: { type:  'string' }
        }
    })

    // Customer body schema
    fastify.addSchema({
        $id: 'CustomerBody',
        type: 'object',
        properties: {
            customerType: {
                type:  'string',
                enum: ['FIT', 'Group']
            },
            picData: {
                type: 'object',
                properties: {
                    picName: { type: 'string' },
                    picTelp: { type: 'string' },
                    picEmail: { type: 'string' },
                    picAddress: { type: 'string' },
                    picBirthday: { type: 'object', format: 'date' },
                    picBirthplace: { type: 'string' },
                    picHobbies: {
                        type: 'array',
                        items: { type: 'string' }
                    },
                }
            },
            companyData: {
                type: 'object',
                properties: {
                    companyName: { type: 'string' },
                    companyTelp: { type: 'string' },
                    companyEmail: { type: 'string' },
                    companyAddress: { type: 'string' }
                }
            }
        }
    })

    // Accommodation History body schema
    // Front end: moment -> form an object -> JSON.stringify -> send with fetch
    // Back end: format date to object in preValidation -> go to handler
    fastify.addSchema({
        $id: 'AccommodationHistoryBody',
        type: 'object',
        properties: {
            accommodation: { type: 'string' },
            customer: { type: 'string' },
            status: { type: 'string', enum: ['Booked', 'DP Paid', 'Fully Paid', 'Canceled'] },
            checkInDateTime: { type: 'object', format: 'date-time' },
            checkOutDateTime: { type: 'object', format: 'date-time' },
            customInquiries: { type: 'string' },
            source: { type: 'string' }
        }
    })
}