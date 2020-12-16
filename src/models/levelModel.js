const mongoose = require("mongoose")

const levelSchema = new mongoose.Schema({
    levelName: String,
    actionPermissions: [{ action_name: String, permissible: Boolean }]
})

module.exports = mongoose.model('Level', levelSchema)