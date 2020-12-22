const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    fullname: { type: String, required: true },
    nickname: String,
    KIP: { type: String, unique: true, index: true, sparse: true },
    username: { type: String, unique: true },
    password: String,
    email: String,
    division: { type: mongoose.Schema.Types.ObjectId, ref: 'Division' },
    level: { type: mongoose.Schema.Types.ObjectId, ref: 'Level' }
})

module.exports = mongoose.model('User', userSchema)