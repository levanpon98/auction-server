const mongoose = require('mongoose')

const productSchema = mongoose.Schema({ 
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        auto: true,
    },
    title: { type: String, required: true},
    price: {type: Number, required: true},
    description: {type: String, required: true},
    status: Number
});

module.exports = mongoose.model('Product', productSchema);
