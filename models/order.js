const mongoose = require('mongoose')

const orderSchema = mongoose.Schema({ 
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        auto: true,
    },
    user_id : {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true}
})

module.exports = mongoose.model('Order', orderSchema)