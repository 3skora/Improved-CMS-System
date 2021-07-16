const express = require("express");
const router = express.Router();
const Semester = require("../models/Semester");
const { semesterValidation } = require("../validation");
const { authStaff, authStudent, authAdmin, auth } = require("../auth");


router.get("/all", async (req, res) => {
    const data = await Semester.find({})
    res.json(data);
});

router.post("/", authAdmin, async (req, res) => {
    try {
        const { error } = semesterValidation(req.body);
        if (error) {
            return res.status(400).json(error.details[0].message);
        }
        const newSemester = new Semester(req.body);
        const savedSemester = await newSemester.save();
        res.json(savedSemester);
    } catch (err) {
        console.log("catch error")
        console.log(err)
        if (err.driver && err.name == "MongoError" && err.keyValue)
            res.json(`${err.keyValue.code} already exists`)
        res.json(err);
    }
});

module.exports = router;
