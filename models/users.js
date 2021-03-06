const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    _id: {type: mongoose.Schema.Types.ObjectId, auto: true},
    displayName: String,
    first_name: String,
    last_name: String,
    dayofbirth: Date,
    address: String,
    phone: String,
    store_name: String,
    email: {
        type: String,
        required: true,
        unique: true,
        match: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
    },
    password: {type: String, required: true},
    status: {
        type: Number,
        default: 1
    },
    request_for_selling: {
        type: Number,
        default: 0
    },
    is_seller: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('User', userSchema);
