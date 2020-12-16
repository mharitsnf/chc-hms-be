const mongoose = require("mongoose")

const accommodationHistorySchema = new mongoose.Schema({
    accommodation: { type: mongoose.Schema.Types.ObjectId, ref: 'Accommodation' },
    customer: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer' },
    status: String,
    checkInDateTime: Date,
    checkOutDateTime: Date,
    customInquiries: String
})

module.exports = mongoose.model('AccommodationHistory', accommodationHistorySchema)