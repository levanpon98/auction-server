const mongoose = require('mongoose')

const provinceSchema = mongoose.Schema({
    name: {type: String, required: true },
    slug: {type: String, required: true },
    type: {type: String, required: true },
    name_with_type: {type: String, required: true },
    code: {type: String, required: true }
}, {
    timestamps: true
});

module.exports = mongoose.model('Province', provinceSchema);
