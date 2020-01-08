const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const User = require('../models/users');

const PasswordResetToken = require('../models/reset_token');

exports.signup = (req, res, next) => {
    User.find({email: req.body.email})
        .exec()
        .then(user => {
            if (user.length >= 1) {
                res.status(200).json({
                    message: "Mail is already used",
                    oke: 0
                })
            } else {
                bcrypt.hash(req.body.password, 10, (err, hash) => {
                    if (err) {
                        return res.status(200).json({error: err, oke: 0})
                    } else {
                        const user = new User({
                            email: req.body.email,
                            password: hash,
                            displayName: req.body.username
                        });
                        user
                            .save()
                            .then((result) => {
                                return res.status(201).json({
                                    user: result,
                                    message: "Create user successfully",
                                    ok: 1,
                                    request: {
                                        type: "GET",
                                        url: "http://localhost:4000/user/" + result._id
                                    }
                                })
                            })
                            .catch(e => {
                                return res.status(200).json({
                                    error: e,
                                    ok: 0
                                })
                            });
                    }
                })
            }
        })
}

exports.login = (req, res, next) => {
    User.find({email: req.body.email})
        .exec()
        .then(user => {
            if (user.length < 1) {
                return res.status(200).json({
                    message: "Authentication failed",
                    ok: 0
                })
            } else {
                bcrypt.compare(req.body.password, user[0].password, (err, result) => {
                    if (err) {
                        return res.status(200).json({
                            message: "Authentication failed",
                            ok: 0
                        })
                    }
                    if (result) {
                        console.log(process.env.JWT_KEY)
                        const token = jwt.sign({
                                email: user[0].email,
                                id: user[0]._id
                            }, process.env.JWT_KEY,
                            {
                                expiresIn: "24h"
                            });

                        return res.status(200).json({
                            user: {
                                id: user[0]._id,
                                email: user[0].email,
                                displayName: user[0].displayName,
                                first_name: user[0].first_name,
                                last_name: user[0].last_name,
                                dayofbirth: user[0].dayofbirth,
                                address: user[0].address,
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
}

exports.delete = (req, res, next) => {
    const id = req.params.id;
    User.remove({_id: id})
        .exec()
        .then((result) => {
            res.status(201).json({
                messages: "User deleted successfully",
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

exports.get_all_user = (req, res, next) => {

    User.find()
        .exec()
        .then((users) => {
            const response = {
                count: users.length,
                ok: 1,
                users: users.map(user => {
                    return {
                        id: user._id,
                        username: user.displayName,
                        first_name: user.first_name,
                        last_name: user.last_name,
                        dayofbirth: user.dayofbirth,
                        phone: user.phone,
                        email: user.email,
                        request: {
                            type: "GET",
                            url: 'http://localhost:4000/api/user/' + user._id
                        }
                    }
                })
            };
            res.status(200).json(response)
        })
        .catch(err =>
            res.status(500).json({
                message: "User not found",
                ok: 0
            })
        )
};

exports.get_user_by_id = (req, res, next) => {
    const id = req.params.id;
    if (req.userData.id == id) {
        User.find({_id: id})
            .exec()
            .then((user) => {
                res.status(201).json({
                    user: user[0],
                    request: {
                        type: "GET",
                        url: 'http://localhost:4000/user/' + user[0]._id
                    }
                })
            })
            .catch(err =>
                res.status(500).json({
                    message: "User not found",
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

exports.get_user_for_view = (req, res, next) => {
    const id = req.params.id;
    User.find({_id: id})
        .exec()
        .then((user) => {
            res.status(201).json({
                user: user[0],
                request: {
                    type: "GET",
                    url: 'http://localhost:4000/user/' + user._id
                }
            })
        })
        .catch(err =>
            res.status(500).json({
                message: "User not found",
                ok: 0
            })
        )
}

exports.update_user_by_id = (req, res, next) => {
    const id = req.params.id;
    if (req.userData.id == id) {
        User.findById(id)
            .exec()
            .then(doc => {
                if (doc) {
                    User.updateOne({_id: id}, {$set: req.body})
                        .exec()
                        .then(result => {
                            if (result.nModified == 0) {
                                res.status(200).json({
                                    error: "You haven't changed any information yet",
                                    ok: -1
                                })
                            } else {
                                res.status(200).json({
                                    messages: "User updated successfully",
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

    User.find({email: req.body.email})
        .exec()
        .then(users => {
            user = users[0]
            const reset_token = new PasswordResetToken({
                _userId: user._id,
                token: crypto.randomBytes(16).toString('hex')
            });
            reset_token
                .save()
                .then(async (token) => {
                    const transporter = nodemailer.createTransport({
                        service: "Gmail",
                        auth: {
                            user: process.env.EMAIL_USER,
                            pass: process.env.EMAIL_PASS,
                        }
                    });
                    const mailOptions = {
                        to: user.email,
                        from: process.env.EMAIL_USER,
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

            User.find({_id: reset_token._userId})
                .exec()
                .then((users) => {
                    user = users[0];
                    bcrypt.hash(req.body.password, 10, (err, hash) => {
                        if (err) {
                            return res.status(500).json({error: err, oke: 0})
                        } else {
                            user.password = hash;
                            console.log(user)
                            user.save()
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
                    return res.status(500).send({message: "User does not exist", ok: 0});
                });
        })
        .catch(err => {
            return res.status(409).json({message: 'Invalid URL', ok: 0});
        })
}

exports.change_password = (req, res, next) => {
    const id = req.params.id;
    if (req.userData.id == id) {
        User.findById(id)
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
                                User.updateOne({_id: id}, {$set: {password: hash}})
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

exports.block_user = (req, res, next) => {
    const id = req.params.id;
    User.findById(id)
        .exec()
        .then(doc => {
            User.updateOne({_id: id}, {$set: {status: 0}})
                .exec()
                .then(() => {
                    res.status(200).json({
                        messages: "User has been block",
                        ok: 1
                    })
                })
                .catch(err => {
                    res.status(200).json({
                        error: err,
                        ok: 0
                    })
                })
        })
        .catch(err => {
            res.status(200).json({
                error: err,
                ok: 0
            });
        })
};

exports.unblock_user = (req, res, next) => {
    const id = req.params.id;
    User.findById(id)
        .exec()
        .then(doc => {
            User.updateOne({_id: id}, {$set: {status: 1}})
                .exec()
                .then(() => {
                    res.status(200).json({
                        messages: "User has been block",
                        ok: 1
                    })
                })
                .catch(err => {
                    res.status(200).json({
                        error: err,
                        ok: 0
                    })
                })
        })
        .catch(err => {
            res.status(200).json({
                error: err,
                ok: 0
            });
        })
};
