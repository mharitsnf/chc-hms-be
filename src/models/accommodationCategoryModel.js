const mongoose = require("mongoose")

const accommodationCategorySchema = new mongoose.Schema({
    name: { type: String, required: true }
})

module.exports = mongoose.model('AccommodationCategory', accommodationCategorySchema)