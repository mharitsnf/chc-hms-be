const mongoose = require("mongoose")

const accommodationCategorySchema = new mongoose.Schema({
    category: String
})

module.exports = mongoose.model('AccommodationCategory', accommodationCategorySchema)