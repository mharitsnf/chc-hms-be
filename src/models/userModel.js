const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    fullname: String,
    nickname: String,
    KIP: String,
    division: { type: mongoose.Schema.Types.ObjectId, ref: 'Division' },
    level: { type: mongoose.Schema.Types.ObjectId, ref: 'Level' }
})

module.exports = mongoose.model('User', userSchema)