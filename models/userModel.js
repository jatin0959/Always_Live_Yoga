const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    referrer: { type: String },
    verified: { type: Boolean, default: false },
    referralLink: { type: String, unique: true },
    karmaPoints: { type: Number, default: 0 },
    referredBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    rewards: { type: Number, default: 0 },
    videosAccessed: [{ type: Number, default: 0 }], // Track accessed video IDs
    registrationDate: { type: Date, default: Date.now },

});

const User = mongoose.model('User', userSchema);

module.exports = User