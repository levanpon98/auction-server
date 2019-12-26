const mongoose = require('mongoose')

const districtSchema = mongoose.Schema({
    title: String
});

module.exports = mongoose.model('AdminRole', districtSchema);
