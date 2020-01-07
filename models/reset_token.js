const mongoose = require('mongoose');

const resettokenSchema = new mongoose.Schema({
    _userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    token: { type: String, required: true },
    createdAt: { type: Date, required: true, default: Date.now, expires: 43200 },
}, {
    timestamps: true
});


module.exports = mongoose.model('passwordResetToken', resettokenSchema);
