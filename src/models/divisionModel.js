const mongoose = require("mongoose")

const divisionSchema = new mongoose.Schema({
    divisionName: { type: String, required: true },
    menuPermissions: [
        {
            menuName: String,
            permissible: {
                type: Boolean,
                default: false
            }
        }
    ]
})

module.exports = mongoose.model('Division', divisionSchema)