const mongoose = require("mongoose")

const divisionSchema = new mongoose.Schema({
    division_name: String,
    menu_permission: [{ name: String }]
})

module.exports = mongoose.model('Division', divisionSchema)