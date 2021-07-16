const jwt = require("jsonwebtoken")

module.exports.authAdmin = (req, res, next) => {
    const token = req.header("token")
    if (!token)
        return res.status(401).send("please log in first");

    try {
        const verified = jwt.verify(token, process.env.tokenSecret)
        if (verified.role !== "admin")
            return res.status(401).send("Access Denied You're NOT an Admin");
        req.user = verified
        next();
    } catch (error) {
        return res.status(400).send("Invalid token");
    }
}
module.exports.authStaff = (req, res, next) => {
    const token = req.header("token")
    if (!token)
        return res.status(401).send("please log in first");

    try {
        const verified = jwt.verify(token, process.env.tokenSecret)
        if (verified.role !== "staff")
            return res.status(401).send("Access Denied You're NOT an Staff");
        req.user = verified
        next();
    } catch (error) {
        return res.status(400).send("Invalid token");
    }
}
module.exports.authStudent = (req, res, next) => {
    const token = req.header("token")
    if (!token)
        return res.status(401).send("please log in first");

    try {
        const verified = jwt.verify(token, process.env.tokenSecret)
        if (verified.role !== "student")
            return res.status(401).send("Access Denied You're NOT an student");
        req.user = verified
        next();
    } catch (error) {
        return res.status(400).send("Invalid token");
    }
}
module.exports.auth = (req, res, next) => {
    const token = req.header("token")
    if (!token)
        return res.status(401).send("please log in first");

    try {
        const verified = jwt.verify(token, process.env.tokenSecret)
        req.user = verified
        next();
    } catch (error) {
        return res.status(400).send("Invalid token");
    }
}