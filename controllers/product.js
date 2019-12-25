
const Product = require('../models/product')

exports.products_get_all = (req, res, next) => {
    if (!req.query.title) {
        req.query.title = ""
    }
    Product.find({
        title: { $regex: '.*' + req.query.title + '.*' }
    })
        .select('_id title price')
        .exec()
        .then(docs => {
            const response = {
                count: docs.length,
                ok: 1,
                products: docs.map(doc => {
                    return {
                        title: doc.title, 
                        price: doc.price, 
                        _id: doc._id,
                        request: {
                            type: "GET",
                            url: 'http://localhost:4000/product/' + doc._id
                        }
                    }
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

exports.create_product = (req, res, next) => {
    const product = new Product(req.body)

    product
        .save()
        .then((result) => {
            res.status(201).json({
                message: "Create new product successfully",
                ok: 1,
                product: {
                    title: result.title, 
                    price: result.price, 
                    _id: result._id,
                    request: {
                        type: "GET",
                        url: 'http://localhost:4000/product/' + result._id
                    }
                }
            })
        })
        .catch(err => {
            res.status(500).json({
                error: err,
                ok: 0
            })
        });
}

exports.get_product_by_id = (req, res, next) => {
    const id = req.params.id;
    Product.findById(id)
        .select('_id title price')
        .exec()
        .then(doc => {
            if(doc) {
                res.status(200).json({
                    product: doc,
                    request: {
                        type: "GET",
                        url: 'http://localhost:4000/product/' + doc._id
                    }
                });
            } else {
                res.status(404).json({
                    message: "No valid entry found",
                    ok: 0
                })
            }
        })
        .catch(err => {
            res.status(500).json({
                error: err,
                ok: 0
            });
        })
}

exports.update_product_by_id = (req, res, next) => {
    const id = req.params.id;
    Product.findById(id)
        .exec()
        .then(doc => {
            if(doc) {
                Product.updateOne({_id: id}, {$set: req.body})
                    .exec()
                    .then(result => {
                        if(result.nModified == 0) {
                            res.status(404).json({
                                message:"You haven't changed any information yet",
                                ok: 0
                            })
                        } else {
                            res.status(200).json({
                                messages: "Product updated successfully",
                                ok: 1,
                                request: {
                                    type: "GET",
                                    url: 'http://localhost:4000/product/' + id
                                }
                            })
                        }
                    })
                    .catch(err => {
                        res.status(500).json({
                            error: err,
                            ok: 0
                        })
                    }) 
            } else {
                res.status(404).json({
                    message: "No valid entry found",
                    ok: 0
                })
            }
        })
        .catch(err => {
            res.status(500).json({
                error: err,
                ok: 0
            });
        })
    
}

exports.delete_product_by_id = (req, res, next) => {
    const id = req.params.id;
    Product.remove({_id: id})
        .exec()
        .then((result) => {
            res.status(201).json({
                messages: "Product deleted successfully",
                ok: 1
            })
        })
        .catch(err => {
            res.status(500).json({
                error: err,
                ok: 0
            })
        });

    
}
