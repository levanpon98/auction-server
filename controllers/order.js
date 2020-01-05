const mongoose = require('mongoose');
const randomstring = require("randomstring");

const Order = require('../models/order');
const User = require('../models/users');
const Product = require('../models/product');
const OrderDetail = require('../models/order_detail');


exports.get_all_orders = async (req, res, next) => {
    const list_order = await Order.find().sort({_id: 1});

    const order = [];
    await Promise.all(list_order.map(async (doc) => {
        const user_info = await User.find({_id: doc.user_id}).exec().then(res => {
            return res
        });
        const order_detail = await OrderDetail.find({order_id: doc._id}).exec()
            .then(res => {
                return res
            });

        const order_detail_ = await Promise.all(order_detail.map(async doc => {
            const product = await Product.find({_id: doc.product_id});
            return {
                quantity: doc.quantity,
                product_info: product
            }
        }));
        order.push({
            user_info: user_info,
            detail: order_detail_
        })
    }));
    return res.status(200).json(order);
};

exports.get_order_by_user_id = async (req, res, next) => {
    const id = req.params.id;
    const list_order = await Order.find({user_id: id}).sort({_id: 1});
    const order = [];
    await Promise.all(list_order.map(async (doc) => {
        const user_info = await User.find({_id: doc.user_id}).exec().then(res => {
            return res
        });
        const order_detail = await OrderDetail.find({order_id: doc._id}).exec()
            .then(res => {
                return res
            });

        const order_detail_ = await Promise.all(order_detail.map(async doc => {
            const product = await Product.find({_id: doc.product_id});
            return {
                quantity: doc.quantity,
                product_info: product
            }
        }));
        order.push({
            user_info: user_info,
            detail: order_detail_
        })
    }));
    return res.status(200).json(order);
};


exports.create_order = (req, res, next) => {
    const order = new Order(
        {user_id: req.body.user_id},
        {address: req.body.address},
        {
            code: randomstring.generate({
                charset: 'numeric'
            })
        },
    );

    order
        .save()
        .then(async (result) => {
            let list_orders = [];

            for (const ops of req.body.order) {
                try {
                    ops["order_id"] = result._id;
                    const order_detail = new OrderDetail(ops);
                    const new_order = await order_detail
                        .save()
                        .then((r) => {
                            return {
                                _id: r._id,
                                product_id: r.product_id,
                                quantity: r.quantity,
                                request: {
                                    type: "GET",
                                    url: 'http://localhost:4000/product/' + r.product_id
                                }
                            }
                        })
                        .catch(err => {
                            return res.status(500).send(err)
                        });
                    if (new_order) {
                        list_orders.push(new_order)
                    }
                } catch (err) {
                    return res.status(500).send(err);
                }
            }
            return res.status(201).json({
                message: "Create new Order successfully",
                ok: 1,
                code: result.code,
                order_detail: list_orders
            })
        })
        .catch((err) => {
            return res.status(500).json({
                error: err,
                ok: 0
            })
        })
};
