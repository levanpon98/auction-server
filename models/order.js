const mongoose = require('mongoose')

const orderSchema = mongoose.Schema({ 
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        auto: true,
    },
    user_id : {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    address: {type: String, required: true},
    code: {type: String, required: true},
});

module.exports = mongoose.model('Order', orderSchema);
