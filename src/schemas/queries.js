
module.exports = ({ fastify }) => {
    // User query
    fastify.addSchema({
        $id: "UserQuery",
        type: 'object',
        properties: {
            fullname: { type: 'string' },
            nickname: { type: 'string' },
            KIP: { type: 'string' },
            email: { type: 'string' },
            username: { type: 'string' },
            level: { type: 'string' },
            division: { type: 'string' }
        }
    })

    // Customer query
    fastify.addSchema({
        $id: "CustomerQuery",
        type: 'object',
        properties: {
            customerType: { type: 'string', enum: ['FIT', 'Group'] },
            picName: { type: 'string' },
            picTelp: { type: 'string' },
            picEmail: { type: 'string' },
            picAddress: { type: 'string' },
            companyName: { type: 'string' },
            companyTelp: { type: 'string' },
            companyEmail: { type: 'string' },
            companyAddress: { type: 'string' }
        }
    })

    // Accommodation query
    fastify.addSchema({
        $id: "AccommodationQuery",
        type: 'object',
        properties: {
            name: { type:  'string' },
            location: { type:  'string' },
            defaultCapacity: { type:  'number' },
            maxCapacity: { type:  'number' },
            category: { type:  'string' }
        }
    })

    // Accommodation History query
    fastify.addSchema({
        $id: "AccommodationHistoryQuery",
        type: 'object',
        properties: {
            accommodation: { type: 'string' },
            customer: { type: 'string' },
            checkInDateTime: { type: 'object', format: 'date-time' },
            checkOutDateTime: { type: 'object', format: 'date-time' }
        }
    })
}