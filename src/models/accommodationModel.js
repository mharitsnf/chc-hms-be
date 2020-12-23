const mongoose = require("mongoose")

const accommodationSchema = new mongoose.Schema({
    name: { type: String, required: true },
    location: { type: String, required: true },
    defaultCapacity: Number,
    maxCapacity: Number,
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'AccommodationCategory', required: true }
})

module.exports = mongoose.model('Accommodation', accommodationSchema)