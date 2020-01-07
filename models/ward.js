const mongoose = require('mongoose');

const wardSchema = mongoose.Schema({
    name: {type: String, required: true },
    slug: {type: String, required: true },
    type: {type: String, required: true },
    name_with_type: {type: String, required: true },
    code: {type: String, required: true },
    path: {type: String, required: true },
    path_with_type: {type: String, required: true },
    parent_code: {type: String, required: true },
}, {
    timestamps: true
});

module.exports = mongoose.model('Ward', wardSchema);
