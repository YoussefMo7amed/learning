const jwt = require("jsonwebtoken");
module.exports = (req, res, next) => {
    try {
        let token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_KEY);
        req.userDate = decoded; // make sure it is not token proparty so don't overwrite it
        next(); // if it success
    } catch (error) {
        return res.status(400).json({
            message: "Auth failed",
        });
    }
};
