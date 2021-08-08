const express = require("express");
const router = express.Router();
const Department = require("../models/Department");
const Course = require("../models/Course");
const { departmentValidation } = require("../validation");
const { authStaff, authStudent, authAdmin, auth } = require("../auth");

router.get("/all", async (req, res) => {
    const data = await Department.find({})
    res.json(data);
});

router.post("/", async (req, res) => {
    try {
        const { error } = departmentValidation(req.body);
        if (error) {
            return res.status(400).json(error.details[0].message);
        }
        // const { courses } = req.body
        // for (let courseID of courses) {
        //     let found = await Course.findById(courseID)
        //     if (!found)
        //         return res.status(400).json(`course ${courseID} not found`);
        // }
        const newDepartment = new Department(req.body);
        const savedDepartment = await newDepartment.save();
        res.json(savedDepartment);
    } catch (err) {
        console.log("catch error")
        console.log(err)
        if (err.driver && err.name == "MongoError" && err.keyValue)
            res.json(`${err.keyValue.code} already exists`)
        res.json(err);
    }
});

module.exports = router;
