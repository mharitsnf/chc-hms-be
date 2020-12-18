const mongoose = require("mongoose")

const accommodationCategorySchema = new mongoose.Schema({
    name: String
})

module.exports = mongoose.model('AccommodationCategory', accommodationCategorySchema)