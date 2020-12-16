const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    fullname: String,
    nickname: String,
    KIP: { type: String, unique: true, index: true, sparse: true },
    username: { type: String, unique: true },
    password: String,
    email: String,
    last_login: Date,
    division: { type: mongoose.Schema.Types.ObjectId, ref: 'Division' },
    level: { type: mongoose.Schema.Types.ObjectId, ref: 'Level' }
})

module.exports = mongoose.model('User', userSchema)