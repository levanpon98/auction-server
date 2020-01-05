const mongoose = require('mongoose');

const Cart = require('../models/cart');
const Product = require('../models/product');

exports.add_to_cart = (req, res, next) => {
    const id = req.params.id;
    const cart = new Cart(req.session.cart ? req.session.cart : {});

    Product.find({_id: id})
        .exec()
        .then(res => {
            cart.add(res, res._id);
            req.session.cart = cart;

        })
        .catch(err => {
            res.status(500).json({message: "Product not found"})
        })
};
