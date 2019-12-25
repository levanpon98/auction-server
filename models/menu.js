const mongoose = require('mongoose')

const productSchema = mongoose.Schema({ 
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        auto: true,
    },
    title: { type: String, required: true},
    link: {type: String, required: true},
    parent_menu: {type: mongoose.Schema.Types.ObjectId, ref: "Menu"}
})

module.exports = mongoose.model('Menu', productSchema)