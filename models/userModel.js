const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    name: String,
    phone: String,
    referrer: { type: String, default: null },
    verified: { type: Boolean, default: false },
    uniqueId: { type: String, required: true, unique: true }, // Add uniqueId field

    whatsapp: String,
    karmaPoints: { type: Number, default: 0 }
});

const User = mongoose.model('User', userSchema);

module.exports = User