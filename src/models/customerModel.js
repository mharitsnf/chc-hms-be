const mongoose = require("mongoose")

const customerSchema = new mongoose.Schema({
    customerType: String,
    picData: {
        picName: String,
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