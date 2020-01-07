const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    image: {type: String, required: true},
});

module.exports = mongoose.model('Galleries', productSchema);
