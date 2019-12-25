const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    _id: {type: mongoose.Schema.Types.ObjectId, auto: true},
    displayName: String,
    first_name: String,
    last_name: String,
    dayofbirth: Date,
    address: String,
    phone: String,
    email: {
        type: String,
        required: true,
        unique: true,
        match: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
    },
    password: {type: String, required: true}
})

module.exports = mongoose.model('User', userSchema)
