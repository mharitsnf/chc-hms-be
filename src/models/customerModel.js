const mongoose = require("mongoose")

const customerSchema = new mongoose.Schema({
    customerType: { type: String, enum: ['FIT', 'Group'], required: true},
    picData: {
        picName: { type: String, required: true },
        picTelp: String,
        picEmail: String,
        picAddress: String,
        picBirthday: Date,
        picBirthplace: String,
        picHobbies: [String]
    },
    companyData: {
        companyName: String,
        companyTelp: String,
        companyEmail: String,
        companyAddress: String,
    }
})

module.exports = mongoose.model('Customer', customerSchema)