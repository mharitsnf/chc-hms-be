const mongoose = require("mongoose")

const divisionSchema = new mongoose.Schema({
    division_name: String,
    menu_permission: Array
})

module.exports = mongoose.model('Division', divisionSchema)