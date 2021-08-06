const express = require("express");
const router = express.Router();
const Course = require("../models/Course");
const Folder = require("../models/Folder");
const Content = require("../models/Content")
const Notification = require("../models/Notification")
const moment = require("moment")
const { contentValidation } = require("../validation");
const { deleteContent, tagHelper } = require("../helpers")
const { authStaff, authStudent, authAdmin, auth } = require("../auth");

const fs = require('fs')
const multer = require('multer');
const User = require("../models/User");
// const { storage, cloudinary } = require("../cloudinary")
// const { cloudinary } = require("../cloudinary")
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, `D:/GUC/bachelor/client/public/uploads/`)
    },
    filename: function (req, file, cb) {
        const dotIndex = file.originalname.lastIndexOf(".")
        cb(null, file.originalname.substring(0, dotIndex) + '-' + Date.now() + file.originalname.substring(dotIndex))
    }
})
const upload = multer({ storage })
// const upload = multer({ dest: "../client/public/uploads/" })


if (process.env.NODE_ENV !== "production") {
    const dotenv = require("dotenv")
    dotenv.config()
}


router.get("/:contentID", auth, async (req, res) => {
    try {
        const { contentID } = req.params
        const data = await Content.findById(contentID).populate("author")
        res.send(data)
    } catch (error) {
        console.log(error)
        return res.status(400).json(error.details[0].message);
    }

});


router.get('/:contentID/download', async (req, res) => {
    try {
        const { contentID } = req.params
        const data = await Content.findById(contentID)
        res.download(data.file.path)
        //    const download = cloudinary.
    } catch (error) {
        console.log(error)
        return res.status(400).json(error.details[0].message);
    }
});

//http://res.cloudinary.com/improved-cms/raw/upload/fl_attachment/v1624779647/mhap4v8yuo9iloksbiyv.pdf
//localhost:8080/contents/upload/60c5bb45cf8bd0281c189758
router.post("/upload/:folderID", authStaff, upload.single('file'), async (req, res) => {
    try {
        // console.log(req.file)
        //   const result =  await cloudinary.uploader.upload(req.file.path, { resource_type: "raw"},
        //         function (error, result) { console.log(result, error); });
        req.body.tag = tagHelper(req.body.tag)
        const { error } = contentValidation({ ...req.body, file: req.file });
        if (error)
            return res.status(400).json(error.details[0].message);


        //check course in courses DB
        const { folderID } = req.params
        const foundFolder = await Folder.findById(folderID)
        if (!foundFolder)
            return res.status(400).json(`Folder ${folderID} not found`);

        //save content in DB
        const newContent = new Content({ author: req.user.id, folderID, ...req.body, file: req.file, })
        const savedContent = await newContent.save()
        // console.log("🚀 ~ file: content.js ~ line 82 ~ router.post ~ savedContent", savedContent)

        //add content to course array
        await Folder.findByIdAndUpdate(folderID, { $addToSet: { contents: [savedContent._id] } },
            { new: true, runValidators: true, useFindAndModify: true })

        const { courseID } = req.body
        const courseData = await Course.findById(courseID)

        //add notification
        const userData = await User.findById(req.user.id)
        const authorFullName = `${userData.firstName} ${userData.lastName}`
        const courseNameCode = `${courseData.name} (${courseData.code})`
        const notificationDetails = `to ${courseNameCode} course`
        const text = `${authorFullName} uploaded a new content ${notificationDetails}`
        const type = "content"
        const refID = folderID
        const newNotification = new Notification({ role: userData.role, text, type, refID })
        const savedNotification = await newNotification.save()

        //send the notification 
        const studentsArr = courseData.students
        const staffArr = courseData.staff

        for (const studentID of studentsArr) {
            await User.findByIdAndUpdate(studentID, { $addToSet: { notifications: [savedNotification._id] } },
                { new: true, runValidators: true, useFindAndModify: true })
        }

        for (const staffID of staffArr) {
            if (staffID != req.user.id)
                await User.findByIdAndUpdate(staffID, { $addToSet: { notifications: [savedNotification._id] } },
                    { new: true, runValidators: true, useFindAndModify: true })
        }

        res.send(savedContent)
    }
    catch (err) {
        console.log("catch error")
        console.log(err)
        if (err.driver && err.name == "MongoError" && err.keyValue)
            res.json(`${err.keyValue.code} already exists`)
        fs.unlinkSync(req.file.path)
        res.json(err);
    }
});

router.delete("/:contentID", authStaff, async (req, res) => {
    try {
        const { contentID } = req.params
        const foundContent = await Content.findById(contentID)
        if (!foundContent)
            return res.status(400).json("Content not found");

        deleteContent(contentID)
        res.send("content deleted");

    } catch (err) {
        console.log("catch error")
        console.log(err)
        res.json(err);
    }
});


module.exports = router;