const mongoose = require("mongoose");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.get_all_users = (req, res, next) => {
    User.find()
        .exec()
        .then((docs) => {
            res.status(200).json(docs);
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json({
                error: err,
            });
        });
};

exports.post_signup = (req, res, next) => {
    User.findOne({ email: req.body.email })
        .exec()
        .then((user) => {
            if (user !== null) {
                return res.status(409).json({
                    message: "Mail Exists",
                });
            } else {
                bcrypt.hash(req.body.password, 10, (error, hash) => {
                    if (error) {
                        return res.status(500).json({
                            error: error,
                        });
                    } else {
                        const user = new User({
                            _id: mongoose.Types.ObjectId(),
                            email: req.body.email,
                            // adding salt (words to the password that user uses); so it can't be figur it out in dictionary table
                            password: hash,
                        });
                        user.save()
                            .then((result) => {
                                console.log(result);
                                res.status(200).json({
                                    message: "user created",
                                });
                            })
                            .catch((error) => {
                                return res.status(500).json({
                                    error: "invalid Email",
                                });
                            });
                    }
                });
            }
        });
};

exports.post_login = (req, res, next) => {
    User.findOne({ email: req.body.email })
        .exec()
        .then((user) => {
            if (user === null) {
                return res.status(401).json({
                    message: "Auth failed",
                });
            }
            bcrypt.compare(req.body.password, user.password, (err, result) => {
                if (err) {
                    return res.status(401).json({
                        message: "Auth failed",
                    });
                }
                if (result) {
                    const token = jwt.sign(
                        {
                            email: user.email,
                            userId: user._id,
                        },
                        process.env.JWT_KEY,
                        {
                            expiresIn: "1h",
                        }
                    );
                    return res.status(200).json({
                        message: "Auth Successful",
                        token: token,
                    });
                }
                return res.status(401).json({
                    message: "Auth failed",
                });
            });
        })
        .catch((error) => {
            return res.status(500).json({
                error: "invalid Email",
            });
        });
};

exports.delete_user = (req, res, next) => {
    User.findByIdAndDelete({ _id: req.params.userId })
        .exec()
        .then((result) => {
            res.status(200).json({
                message: "user deleted",
            });
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json({
                error: err,
            });
        });
};
