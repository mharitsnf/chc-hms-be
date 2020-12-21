const mongoose = require("mongoose")

const levelSchema = new mongoose.Schema({
    levelName: { type: String, required: true },
    actionPermissions: [
        {
            actionName: {
                type: String,
                enum: ['create', 'read', 'update', 'delete']
            },
            permissible: {
                type: Boolean,
                default: false
            }
        }
    ]
})

module.exports = mongoose.model('Level', levelSchema)