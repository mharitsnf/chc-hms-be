const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    fullname: String,
    nickname: String,
    KIP: String,
    username: String,
    password: String,
    email: String,
    last_login: Date,
    division: { type: mongoose.Schema.Types.ObjectId, ref: 'Division' },
    level: { type: mongoose.Schema.Types.ObjectId, ref: 'Level' }
})

module.exports = mongoose.model('User', userSchema)