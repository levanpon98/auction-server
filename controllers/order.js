const mongoose = require('mongoose')
const Order = require('../models/order')
const OrderDetail = require('../models/order_detail')



exports.get_all_orders = (req, res, next) => {
    Order.find()
        .exec()
        .then(docs => {
            const response = {
                count: docs.length, 
                ok: 1,
                order: docs.map(doc => {
                    
                    OrderDetail.find({order_id: doc._id})
                        .select('')
                        .exec()
                        .then(list => {
                            return list
                        })
                })
            }
            res.status(200).json(response)

        }).catch(err => {
            res.status(500).json({
                error: err,
                ok: 0
            })
        })
}

exports.create_order = (req, res, next) => {
    const order = new Order({user_id: req.body.user_id})
    
    order
        .save()
        .then(async (result) => {
            list_orders = []
            
            for(const ops of req.body.order) {
                try {
                    ops["order_id"] = result._id
                    const order_detail = new OrderDetail(ops)
                    
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
                            return {}
                        })
                    
                    if(new_order) {
                        list_orders.push(new_order)
                    }
                } catch (err) {
                    res.status(500).send(err);
                }
            }

            res.status(201).json({
                message: "Create new Order successfully",
                ok: 1,
                order_detail: list_orders
            })
        })
        .catch((err) => {
            res.status(500).json({
                error: err,
                ok: 0
            })
        })
}