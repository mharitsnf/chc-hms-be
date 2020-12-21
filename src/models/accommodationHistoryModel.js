const mongoose = require("mongoose")

const accommodationHistorySchema = new mongoose.Schema({
    accommodation: { type: mongoose.Schema.Types.ObjectId, ref: 'Accommodation' },
    customer: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer' },
    status: { type: String, enum: ['Booked', 'DP Paid', 'Fully Paid', 'Canceled'] },
    checkInDateTime: Date,
    checkOutDateTime: Date,
    customInquiries: String
}, { timestamps: true })

module.exports = mongoose.model('AccommodationHistory', accommodationHistorySchema)