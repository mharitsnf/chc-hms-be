
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

    // Accommodation Category serializer schema
    fastify.addSchema({
        $id: 'AccommodationCategorySerializer',
        type: 'object',
        properties: {
            _id: { type: 'string' },
            name: { type:  'string' }
        }
    })

    // Accommodation serializer schema
    fastify.addSchema({
        $id: 'AccommodationSerializer',
        type: 'object',
        properties: {
            _id: { type: 'string' },
            name: { type:  'string' },
            location: { type:  'string' },
            defaultCapacity: { type:  'number' },
            maxCapacity: { type:  'number' },
            category: { $ref: 'AccommodationCategorySerializer#' }
        }
    })

    // Customer serializer schema
    fastify.addSchema({
        $id: 'CustomerSerializer',
        type: 'object',
        properties: {
            _id: { type: 'string' },
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
                    picBirthday: { type: 'string' },
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

    // Accommodation History serializer schema
    fastify.addSchema({
        $id: 'AccommodationHistorySerializer',
        type: 'object',
        properties: {
            _id: { type: 'string' },
            accommodation: { $ref: 'AccommodationSerializer#' },
            customer: { $ref: 'CustomerSerializer#' },
            status: { type: 'string', enum: ['Booked', 'DP Paid', 'Fully Paid'] },
            checkInDateTime: { type: 'string' },
            checkOutDateTime: { type: 'string' },
            customInquiries: { type: 'string' },
        }
    })

    // Customer History serializer
    fastify.addSchema({
        $id: 'CustomerHistorySerializer',
        type: 'object',
        properties: {
            _id: { type: 'string' },
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
                    picBirthday: { type: 'string' },
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
            },
            histories: {
                type: 'array',
                items: { $ref: 'AccommodationHistorySerializer#' }
            }
        }
    })
}