const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { userValidation } = require("../validation");
const bcrypt = require("bcryptjs");
const { authStaff, authStudent, authAdmin, auth } = require("../auth");

router.get("/allStudents", async (req, res) => {
    try {
        const data = await User.find({ role: "student" })
        res.json(data)

    } catch (error) {
        res.json(error);
    }
});
router.get("/allStaff", async (req, res) => {
    try {
        const data = await User.find({ role: "staff" })
        res.json(data)

    } catch (error) {
        res.json(error);
    }
});

//localhost:8080/users/
// {
//     "firstName" : "Ahmed",
//     "lastName" : "Askora",
//     "email" : "ahmed.askora@gmail.com",
//     "role" : "student",
//     "gucID" : "43-18023"
// }
router.post("/", async (req, res) => {
    try {
        const { error } = userValidation(req.body);
        if (error) {
            return res.status(400).json(error.details[0].message);
        }
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(req.body.password, salt);

        const newUser = new User({ ...req.body, password: hashPassword });
        const savedUser = await newUser.save();
        res.json(savedUser);
    } catch (err) {
        console.log("catch error")
        console.log(err)
        if (err.driver && err.name == "MongoError" && err.keyValue)
            res.json(`${err.keyValue.code} already exists`)
        res.json(err);
    }
});

module.exports = router;
