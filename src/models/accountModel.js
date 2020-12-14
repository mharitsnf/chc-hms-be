const mongoose = require("mongoose")

const accountSchema = new mongoose.Schema({
    username: String,
    password: String,
    email: String,
    create_date: Date,
    last_login: Date,
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
})

module.exports = mongoose.model('Account', accountSchema)