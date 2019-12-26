const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const Admin = require('../models/admin');
const PasswordResetToken = require('../models/reset_token');


exports.login = (req, res, next) => {
    Admin.find({email: req.body.email})
        .exec()
        .then(admin => {
            if (admin.length < 1) {
                return res.status(200).json({
                    message: "Authentication failed",
                    ok: 0
                })
            } else {
                bcrypt.compare(req.body.password, admin[0].password, (err, result) => {
                    if (err) {
                        return res.status(200).json({
                            message: "Authentication failed",
                            ok: 0
                        })
                    }
                    if (result) {
                        const token = jwt.sign({
                                email: admin[0].email,
                                id: admin[0]._id
                            }, process.env.JWT_KEY,
                            {
                                expiresIn: "24h"
                            });

                        return res.status(200).json({
                            admin: {
                                id: admin[0]._id,
                                email: admin[0].email,
                                username: admin[0].username,
                                first_name: admin[0].first_name,
                                last_name: admin[0].last_name,
                            },
                            message: "Authentication successful",
                            ok: 1,
                            token: token
                        })
                    }
                    res.status(200).json({
                        message: "Authentication failed",
                        ok: 0
                    })
                })
            }
        }).catch(err => {
        return res.status(200).json({
            error: err,
            ok: 0
        })
    })
};

exports.get_admin_by_id = (req, res, next) => {
    const id = req.params.id;
    if (req.userData.id == id) {
        Admin.find({_id: id})
            .exec()
            .then((admin) => {
                res.status(201).json({
                    admin: admin[0]
                })
            })
            .catch(err =>
                res.status(500).json({
                    message: "admin not found",
                    ok: 0
                })
            )
    } else {
        res.status(500).json({
            message: "Access denied",
            ok: 0
        })
    }
};

exports.get_admin_for_view = (req, res, next) => {
    const id = req.params.id;
    admin.find({_id: id})
        .exec()
        .then((admin) => {
            res.status(201).json({
                admin: admin[0],
                request: {
                    type: "GET",
                    url: 'http://localhost:4000/admin/' + admin._id
                }
            })
        })
        .catch(err =>
            res.status(500).json({
                message: "admin not found",
                ok: 0
            })
        )
}

exports.update_admin_by_id = (req, res, next) => {
    const id = req.params.id;
    if (req.adminData.id == id) {
        admin.findById(id)
            .exec()
            .then(doc => {
                if (doc) {
                    admin.updateOne({_id: id}, {$set: req.body})
                        .exec()
                        .then(result => {
                            if (result.nModified == 0) {
                                res.status(200).json({
                                    error: "You haven't changed any information yet",
                                    ok: -1
                                })
                            } else {
                                res.status(200).json({
                                    messages: "admin updated successfully",
                                    ok: 1
                                })
                            }
                        })
                        .catch(err => {
                            res.status(200).json({
                                error: err,
                                ok: 0
                            })
                        })
                } else {
                    res.status(200).json({
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
    } else {
        res.status(500).json({
            message: "Access denied",
            ok: 0
        })
    }
};

exports.forgot_password = (req, res, next) => {

    if (!req.body.email) {
        return res.status(500).json({message: 'Email is required', ok: 0});
    }

    admin.find({email: req.body.email})
        .exec()
        .then(admins => {
            admin = admins[0]
            const reset_token = new PasswordResetToken({
                _adminId: admin._id,
                token: crypto.randomBytes(16).toString('hex')
            });
            reset_token
                .save()
                .then(async (token) => {
                    const transporter = nodemailer.createTransport({
                        service: "Gmail",
                        auth: {
                            admin: process.env.EMAIL_admin,
                            pass: process.env.EMAIL_PASS,
                        }
                    });
                    const mailOptions = {
                        to: admin.email,
                        from: process.env.EMAIL_admin,
                        subject: '[Auction] Password Reset',
                        text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
                            'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
                            process.env.URL_PRONTEND + '/reset-password/' + token.token + '\n\n' +
                            'If you did not request this, please ignore this email and your password will remain unchanged.\n'
                    }
                    transporter.sendMail(mailOptions, (err, info) => {
                        if (err) {
                            return res.status(500).json({error: err, ok: 0})
                        } else {
                            return res.status(200).json({
                                message: "Send mail successfully",
                                ok: 1
                            })
                        }
                    })
                })
                .catch((err) => {
                    return res.status(500).json({error: err, ok: 0})
                })
        })
        .catch(err => {
            return res.status(500).json({
                message: err,
                ok: 0
            })
        })
}

exports.reset_password = (req, res, next) => {
    if (!req.body.token) {
        return res.status(500).json({message: 'Token is required', ok: 0});
    }
    if (!req.body.password) {
        return res.status(500).json({message: 'Password is required', ok: 0});
    }
    PasswordResetToken.findOne({token: req.body.token})
        .exec()
        .then(reset_token => {
            if (!reset_token) {
                return res
                    .status(409)
                    .json({message: 'Token has expired'});
            }

            admin.find({_id: reset_token._adminId})
                .exec()
                .then((admins) => {
                    admin = admins[0];
                    bcrypt.hash(req.body.password, 10, (err, hash) => {
                        if (err) {
                            return res.status(500).json({error: err, oke: 0})
                        } else {
                            admin.password = hash;
                            console.log(admin)
                            admin.save()
                                .then((result) => {
                                    return res.status(201).json({
                                        message: "Update password successfully",
                                        ok: 1,
                                    })
                                })
                                .catch(e => {
                                    return res.status(500).json({
                                        error: e,
                                        ok: 0
                                    })
                                });
                        }
                    })
                })
                .catch((err) => {
                    return res.status(500).send({message: "admin does not exist", ok: 0});
                });
        })
        .catch(err => {
            return res.status(409).json({message: 'Invalid URL', ok: 0});
        })
}

exports.change_password = (req, res, next) => {
    const id = req.params.id;
    if (req.adminData.id == id) {
        admin.findById(id)
            .exec()
            .then(doc => {
                bcrypt.compare(req.body.current_password, doc.password, (err, result) => {
                    if (err) {
                        return res.status(200).json({
                            message: "Change password failed",
                            ok: 0
                        })
                    }
                    if (result) {
                        bcrypt.hash(req.body.new_password, 10, (err, hash) => {
                            if (err) {
                                return res.status(200).json({error: err, oke: 0})
                            } else {
                                admin.updateOne({_id: id}, {$set: {password: hash}})
                                    .exec()
                                    .then(() => {
                                        res.status(200).json({
                                            messages: "Password updated successfully",
                                            ok: 1
                                        })
                                    })
                                    .catch(err => {
                                        res.status(200).json({
                                            error: err,
                                            ok: 0
                                        })
                                    })
                            }
                        })
                    } else {
                        res.status(200).json({
                            message: "Change password failed",
                            ok: 0
                        })
                    }

                })
            })
            .catch(err => {
                res.status(200).json({
                    error: err,
                    ok: 0
                });
            })
    } else {
        res.status(200).json({
            message: "Access denied",
            ok: 0
        })
    }
};

exports.check_token = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_KEY);
        return res.status(200).json({ok: 1})
    } catch {
        return res.status(200).json({ok: 0})
    }
};
