const mongoose = require('mongoose')

const Menu = require('../models/menu')


exports.get_all_menu = async (req, res, next) => {
    menu = [];
    const parent_menu = await Menu.find({parent_menu: {$exists: false}}).sort({_id: 1});

    await Promise.all(parent_menu.map(async (doc) => {
        const sub_menu = await Menu.find({parent_menu: doc._id})
            .exec()
            .then(res => {
                return res
            });

        if (sub_menu.length > 0) {
             menu.push({
                id: doc._id,
                title: doc.title,
                link: doc.link,
                has_children: true,
                children: sub_menu
            })
        } else {
             menu.push({
                id: doc._id,
                title: doc.title,
                link: doc.link,
                has_children: false
            })
        }
    }));
    return res.status(200).json(menu)
};

exports.create_menu = (req, res, next) => {
    const menu = new Menu(req.body)
    menu
        .save()
        .then((result) => {
            res.status(201).json({
                message: "Create new menu successfully",
                ok: 1,
                menu: {
                    title: result.title,
                    link: result.link,
                    _id: result._id,
                    sub_menu: result.sub_menu
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

exports.update_menu = (req, res, next) => {
    const id = req.params.id
    const updateOps = {};
    for (const ops of req.body) {
        updateOps[ops.key] = ops.value
    }
    Menu.findById(id)
        .exec()
        .then(doc => {
            if (doc) {
                Menu.updateOne({_id: id}, {$set: updateOps})
                    .exec()
                    .then(result => {
                        if (result.nModified == 0) {
                            res.status(404).json({
                                message: "You haven't changed any information yet",
                                ok: 0
                            })
                        } else {
                            res.status(200).json({
                                messages: "Menu updated successfully",
                                ok: 1,
                                menu: result
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

exports.delete_menu = (req, res, next) => {
    const id = req.params.id;
    Menu.remove({_id: id})
        .exec()
        .then((result) => {
            res.status(201).json({
                messages: "Menu deleted successfully",
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
