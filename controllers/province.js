const mongoose = require('mongoose')

const Province = require('../models/province');

exports.get_all_provinces = (req, res, next) => {
    Province.find()
        .exec()
        .then(docs => {
            res.status(200).json(docs)
        }).catch(err => {
        res.status(500).json({
            error: err,
            ok: 0
        })
    })
};


