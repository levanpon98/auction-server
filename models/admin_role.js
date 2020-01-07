const mongoose = require('mongoose')

const districtSchema = mongoose.Schema({
    title: String
}, {
    timestamps: true
});

module.exports = mongoose.model('AdminRole', districtSchema);
