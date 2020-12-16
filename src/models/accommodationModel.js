const mongoose = require("mongoose")

const accommodationSchema = new mongoose.Schema({
    name: String,
    location: String,
    defaultCapacity: Number,
    maxCapacity: Number,
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'AccommodationCategory' }
})

module.exports = mongoose.model('Accommodation', accommodationSchema)