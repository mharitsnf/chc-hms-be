const mongoose = require("mongoose")

const levelSchema = new mongoose.Schema({
    level_name: String,
    action_permission: [{ action_name: String, permissible: Boolean }]
})

module.exports = mongoose.model('Level', levelSchema)