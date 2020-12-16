const mongoose = require("mongoose")

const divisionSchema = new mongoose.Schema({
    divisionName: String,
    menuPermissions: [{ name: String }]
})

module.exports = mongoose.model('Division', divisionSchema)