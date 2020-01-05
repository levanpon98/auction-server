const mongoose = require('mongoose');

const Address = require('../models/address');

exports.get_all_addresses = (req, res, next) => {
    Address.find({
        user_id: req.params.user_id
    })
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

exports.create_address = (req, res, next) => {
    const address = new Address(req.body);
    address.user_id = req.params.user_id;

    address
        .save()
        .then((result) => {
            res.status(201).json({
                message: "Create new address successfully",
                ok: 1,
                address: result
            })
        })
        .catch(err => {
            res.status(200).json({
                error: err,
                ok: 0
            })
        });
};

exports.get_address_by_id = (req, res, next) => {

};

exports.update_address_by_id = (req, res, next) => {

};

exports.delete_address_by_id = (req, res, next) => {

};
