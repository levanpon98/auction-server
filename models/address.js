const mongoose = require('mongoose')

const addressSchema = mongoose.Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        auto: true,
    },
    address: {type: String, required: true },
    province: {type: String, required: true },
    district: {type: String, required: true },
    ward: {type: String, required: true },
    user_id: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
    path: String
});

module.exports = mongoose.model('Address', addressSchema);
