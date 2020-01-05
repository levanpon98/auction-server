const mongoose = require('mongoose')

const orderDetailSchema = mongoose.Schema({ 
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        auto: true,
    },
    order_id: {type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true},
    product_id: {type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true},
    quantity: {type: mongoose.Schema.Types.Number, default: 1}
});

module.exports = mongoose.model('OrderDetail', orderDetailSchema);
