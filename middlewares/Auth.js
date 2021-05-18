const jwt = require('jsonwebtoken');
module.exports = async (req, res, next) => {
    try {
        if (!req.headers.authorization) throw "Forbidden!";
        const token = req.headers.authorization.split(" ")[1];
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        req.payload = payload;
        // console.log(payload);
        next();
    } catch (err) {
        console.log(err);
        return res.status(401).json({
            message: "Forbidden!"
        });
    }
};