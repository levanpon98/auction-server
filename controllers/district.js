const mongoose = require('mongoose');

const District = require('../models/district');

exports.get_district = (req, res, next) => {
    District.find({parent_code: req.params.parent_code}).sort({_id: 1})
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


