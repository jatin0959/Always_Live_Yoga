const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    name: String,
    phone: String,
    referrer: String,
    verified: { type: Boolean, default: false },
    whatsapp: String,
    karmaPoints: { type: Number, default: 0 }
});

const User = mongoose.model('User', userSchema);

module.exports = User