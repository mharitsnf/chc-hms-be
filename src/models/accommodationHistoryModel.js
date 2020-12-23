const mongoose = require("mongoose")

const accommodationHistorySchema = new mongoose.Schema({
    accommodation: { type: mongoose.Schema.Types.ObjectId, ref: 'Accommodation', required: true },
    customer: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true  },
    status: { type: String, enum: ['Booked', 'DP Paid', 'Fully Paid', 'Canceled'], default: 'Booked' },
    checkInDateTime: { type: Date, required: true },
    checkOutDateTime: { type: Date, required: true },
    customInquiries: String,
    source: String
}, { timestamps: true })

module.exports = mongoose.model('AccommodationHistory', accommodationHistorySchema)