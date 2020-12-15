const mongoose = require("mongoose")

const customerSchema = new mongoose.Schema({
    customer_type: String,
    pic_data: {
        pic_name: String,
        pic_telp: String,
        pic_email: String,
        pic_address: String,
        pic_birthday: Date,
        pic_birthplace: String,
        pic_hobbies: [{ hobby: String }]
    },
    company_data: {
        company_name: String,
        company_telp: String,
        company_email: String,
        company_address: String,
    }
})

module.exports = mongoose.model('Customer', customerSchema)