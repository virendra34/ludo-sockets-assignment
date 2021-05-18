require("dotenv").config();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.register = async (req, res) => {
    const { name, email, password } = req.body;
    const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!emailRegex.test(email)) {
        throw "Please enter a valid email!";
    }
    if (password.length < 6) {
        throw "Password must be atleast 6 charectors long";
    }
    const userExists = await User.findOne({
        email
    });
    if (userExists) {
        throw "Email already exists!";
    }
    const user = new User({
        name, email, password
    });
    // encrypt password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    await user.save();
    return res.json({
        message: "Registration Successful."
    });
}
exports.login = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
        return res.status(400).json({
            message: "Invalid credentials!",
            user,
        });
    }
    try {
        bcrypt.compare(password, user.password, (err, response) => {
            if (err) {
                throw err.message;
            }
            if (response) {
                // return JWT
                const payload = {
                    user: {
                        id: user.id,
                    }
                }
                jwt.sign(
                    payload,
                    process.env.JWT_SECRET,
                    { expiresIn: process.env.JWT_EXPIRES_IN },
                    (err, token) => {
                        if (err) {
                            return res.json({
                                message: err.message
                            });
                        }
                        if (token) {
                            return res.json({
                                message: "Logged in succesfully 😃",
                                token,
                                type: "Bearer",
                            });
                        }
                    }
                );
            } else {
                return res.status(400).json({
                    message: "Invalid credentials❗"
                });
            }
        });
    } catch (err) {
        throw err.message;
    }
}