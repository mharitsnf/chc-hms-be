const mongoose = require("mongoose")

const levelSchema = new mongoose.Schema({
    level_name: String,
    action_permission: Array
})

module.exports = mongoose.model('Level', levelSchema)