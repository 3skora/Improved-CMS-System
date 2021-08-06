const express = require("express");
const router = express.Router();
const Course = require("../models/Course");
const User = require("../models/User");
const Department = require("../models/Department");
const Semester = require("../models/Semester");
const Folder = require("../models/Folder");
const Notification = require("../models/Notification")

const { deleteCourse, deleteContent, getAllBelow } = require("../helpers")


const { courseValidation, assignCourseValidation } = require("../validation");
const { authStaff, authStudent, authAdmin, auth } = require("../auth");

//get courses of user
router.get("/:userID", async (req, res) => {
    try {
        const { userID } = req.params
        const foundUser = await User.findById(userID)
        if (!foundUser)
            return res.status(400).json(`user ${userID} not found`);
        let result = [];
        for (const courseID of foundUser.courses) {
            const courseDetails = await Course.findById(courseID, { rootFolder: 1, _id: 0 })
                // .populate("department", "name")
                // .populate("semester")
                .populate("rootFolder", "folderName")
            // .populate({
            //     path: 'rootFolder',
            //     populate: { path: 'subFolders' }
            // });

            result.push(courseDetails.rootFolder)
        }
        res.json(result)
    } catch (error) {
        res.status(400).json(error)
    }

});
router.get("/code/:code", async (req, res) => {
    try {
        const { code } = req.params
        const foundCourse = await Course.findOne({ code })
        if (!foundCourse)
            return res.status(400).json(`Course not found`);

        res.json(foundCourse)
    } catch (error) {
        res.status(400).json(error)
    }

});

router.get("/find/all", async (req, res) => {
    try {
        const result = await Course.find({})
        res.json(result)
    } catch (error) {
        res.status(400).json(error)
    }

});

//localhost:8080/courses
// {
//     "name" : "Microprocessor",
//     "code" : "CSEN702",
//     "department" : "60b89653513a493214cb9213",
//     "semester" : "60ba92707ccd4c2224f04bae"
// }
router.post("/", authAdmin, async (req, res) => {
    try {
        const { error } = courseValidation(req.body);
        if (error) {
            return res.status(400).json(error.details[0].message);
        }
        //check department in departments DB
        const { department } = req.body
        const foundDepartment = await Department.findById(department)
        if (!foundDepartment)
            return res.status(400).json("department not found");

        //check semester in semesters DB
        const { semester } = req.body
        const foundSemester = await Semester.findById(semester)
        if (!foundSemester)
            return res.status(400).json("semester not found");

        //creat root folder
        const folderName = `${req.body.name} (${req.body.code})`
        const newFolder = new Folder({ folderName });
        const savedFolder = await newFolder.save();


        const newCourse = new Course({ ...req.body, rootFolder: savedFolder._id });
        const savedCourse = await newCourse.save();

        //add course to department array
        foundDepartment.courses.push(savedCourse._id)
        await Department.findByIdAndUpdate(department, { courses: foundDepartment.courses },
            { new: true, runValidators: true, useFindAndModify: true })
        res.json(savedCourse);
        // res.send("savedCourse");
    } catch (err) {
        console.log("catch error")
        console.log(err)
        if (err.driver && err.name == "MongoError" && err.keyValue)
            res.json(`${err.keyValue.code} already exists`)
        res.json(err);
    }
});



//localhost:8080/courses/assignCourse?role=student
// {
//     "users" : ["60c5ba239c297e4abcd29901"],
//     "courses" : ["60c5bb45cf8bd0281c189758"]
// }
router.post("/assignCourse/?", authAdmin, async (req, res) => {
    try {
        const { error } = assignCourseValidation(req.body);
        if (error)
            return res.status(400).json(error.details[0].message);

        const { users, courses } = req.body
        const { role } = req.query

        //check students in Users DB
        if (role == "student") {
            for (let student of users) {
                let result = await User.findById(student)
                if (!result)
                    return res.status(400).json(`user ${student} not found`);
                if (result.role != "student")
                    return res.status(400).json(`user ${result._id} is not a student .. role is ${result.role}`);
            }
        }


        //check staff in Users DB
        if (role == "staff") {
            for (let staff of users) {
                let result = await User.findById(staff)
                if (!result)
                    return res.status(400).json(`user ${staff} not found`);
                if (result.role != "staff")
                    return res.status(400).json(`user ${result._id} is not a staff .. role is ${result.role}`);
            }
        }

        //check courses in courses DB
        for (let courseID of courses) {
            let result = await Course.findById(courseID)
            if (!result)
                return res.status(400).json(`course ${courseID} not found`);
        }

        //add courses to [user.course]
        for (let user of users) {
            let result = await User.findById(user)
            await User.findByIdAndUpdate(user, { courses: result.courses.concat(courses) },
                { new: true, runValidators: true, useFindAndModify: true })
        }

        //add students in course.students
        if (role == "student") {
            for (let courseID of courses) {
                let result = await Course.findById(courseID)
                await Course.findByIdAndUpdate(courseID, { students: result.students.concat(users) },
                    { new: true, runValidators: true, useFindAndModify: true })
            }
        }

        //add staff in course.staff
        if (role == "staff") {
            for (let courseID of courses) {
                let result = await Course.findById(courseID)
                await Course.findByIdAndUpdate(courseID, { staff: result.staff.concat(users) },
                    { new: true, runValidators: true, useFindAndModify: true })
            }
        }


        res.json("course assigned successfully");
    } catch (err) {
        console.log("catch error")
        console.log(err)
        res.json(err);
    }
});

router.post("/assignCoursesForAll", authAdmin, async (req, res) => {
    try {
        const { user, course, role } = req.body

        await User.findByIdAndUpdate(user, { $addToSet: { courses: [course] } },
            { new: true, runValidators: true, useFindAndModify: true })
        if (role === "student") {
            await Course.findByIdAndUpdate(course, { $addToSet: { students: [user] } },
                { new: true, runValidators: true, useFindAndModify: true })
        }

        if (role === "staff") {
            await Course.findByIdAndUpdate(course, { $addToSet: { staff: [user] } },
                { new: true, runValidators: true, useFindAndModify: true })
        }


        res.send("course assigned successfully")

    } catch (error) {
        res.json(error)
    }


})


router.delete("/:courseID", authAdmin, async (req, res) => {
    try {
        const { courseID } = req.params
        const foundCourse = await Course.findById(courseID)
        if (!foundCourse)
            return res.status(400).json("Course not found");

        deleteCourse(courseID)
        res.send("course deleted");

    } catch (err) {
        console.log("catch error", err)
        res.json(err);
    }
});

router.post("/createFolder/:parentFolderID", async (req, res) => {
    try {
        const { parentFolderID } = req.params
        const { folderName } = req.body
        if (!folderName)
            return res.status(400).json("folder name is required");
        const newFolder = new Folder({ folderName });
        const savedFolder = await newFolder.save();

        await Folder.findByIdAndUpdate(parentFolderID, { $addToSet: { subFolders: [savedFolder._id] } })
        res.json(savedFolder)

    } catch (error) {
        res.json(error)
    }
})



router.patch("/editFolder/:rootFolderID", async (req, res) => {
    try {
        const { rootFolderID } = req.params
        const { newFolderName } = req.body
        if (!newFolderName)
            return res.status(400).json("new folder name is required");

        const folderData = await Folder.findByIdAndUpdate(rootFolderID, { folderName: newFolderName },
            { new: true, runValidators: true, useFindAndModify: true })
        res.json(folderData)

    } catch (error) {
        res.json(error)
    }
})


router.delete("/deleteFolder/:rootFolderID", async (req, res) => {
    try {
        const { rootFolderID } = req.params

        const folderData = await Folder.findById(rootFolderID)

        //delete contents of folder from DB and delete its discussions bla bla
        for (const contentID of folderData.contents) {
            deleteContent(contentID)
        }
        res.json(folderData)

    } catch (error) {
        res.json(error)
    }
})


router.get("/folder/:rootFolderID", async (req, res) => {
    try {
        const { rootFolderID } = req.params
        const folderData = await Folder.findById(rootFolderID).populate("subFolders")
        res.json(folderData)

    } catch (error) {
        res.json(error)
    }
})

router.get("/rootFolder/:subFolderID", async (req, res) => {
    try {
        const { subFolderID } = req.params
        const rootFolder = await Folder.findOne({ subFolders: { $in: [subFolderID] } }, { folderName: 1 })
        res.json(rootFolder)

    } catch (error) {
        res.json(error)
    }
})



router.get("/test/:folderID", async (req, res) => {
    try {
        const { folderID } = req.params
        const final = getAllBelow(folderID)
        res.json(final)
    } catch (error) {
        res.json(error)
    }

})

// =================== course Announcements ==========

router.get("/courseAnnouncements/:userID", async (req, res) => {
    try {
        const { userID } = req.params
        const foundUser = await User.findById(userID)
        if (!foundUser)
            return res.status(400).json(`user ${userID} not found`);
        let result = [];
        for (const courseID of foundUser.courses) {
            const courseDetails = await Course.findById(courseID, { courseAnnouncement: 1, name: 1, _id: 1, code: 1 })
            // courseDetails.courseAnnouncement.reverse()
            result.push(courseDetails)
        }
        res.json(result)
    } catch (error) {
        res.status(400).json(error)
    }


});

router.get("/courseAnnouncement/:courseID", async (req, res) => {
    try {
        const { courseID } = req.params
        const courseDetails = (await Course.findById(courseID)).courseAnnouncement
        res.json(courseDetails)
    } catch (error) {
        res.status(400).json(error)
    }


});

router.post("/courseAnnouncements", async (req, res) => {
    try {
        const { newAnnouncement, courseID, author } = req.body
        if (!newAnnouncement)
            return res.status(400).json("newAnnouncement is required");

        if (!courseID)
            return res.status(400).json("courseID is required");

        if (!author)
            return res.status(400).json("author is required");



        const foundCourse = await Course.findByIdAndUpdate(courseID,
            { $push: { courseAnnouncement: { $each: [newAnnouncement], $position: 0 } } },
            { new: true, runValidators: true, useFindAndModify: true })

        const foundAuthor = await User.findById(author)
        const courseNameCode = `${foundCourse.name} (${foundCourse.code})`
        const notificationDetails = `to ${courseNameCode} course`

        //add notification
        const authorFullName = `${foundAuthor.firstName} ${foundAuthor.lastName}`
        const courseAnnouncementIndex = foundCourse.courseAnnouncement.length
        const NotificationType = `announcement#${courseAnnouncementIndex}`
        const text = `${authorFullName} added a new announcement ${notificationDetails}`
        const newNotification = new Notification({ role: foundAuthor.role, text, type: NotificationType, refID: courseID })
        const savedNotification = await newNotification.save()

        //send the notification 
        const studentsArr = foundCourse.students
        const staffArr = foundCourse.staff

        for (const studentID of studentsArr) {
            if (studentID != author) {
                await User.findByIdAndUpdate(studentID, { $addToSet: { notifications: [savedNotification._id] } },
                    { new: true, runValidators: true, useFindAndModify: true })
            }

        }

        for (const staffID of staffArr) {
            if (staffID != author) {
                await User.findByIdAndUpdate(staffID, { $addToSet: { notifications: [savedNotification._id] } },
                    { new: true, runValidators: true, useFindAndModify: true })
            }

        }

        res.json(foundCourse.courseAnnouncement)
    } catch (error) {
        res.status(400).json(error)
    }


});

router.patch("/courseAnnouncements", async (req, res) => {
    try {
        const { newAnnouncement, courseID, index, author } = req.body
        if (!newAnnouncement)
            return res.status(400).json("newAnnouncement is required");

        if (!courseID)
            return res.status(400).json("courseID is required");

        if (!index)
            return res.status(400).json("index is required");

        if (!author)
            return res.status(400).json("author is required");

        // const courseAnnouncementArr = (await Course.findById(courseID)).courseAnnouncement
        // courseAnnouncementArr[index] = newAnnouncement

        const foundCourse = await Course.findByIdAndUpdate(courseID,
            { $set: { [`courseAnnouncement.${index}`]: newAnnouncement } },
            // { courseAnnouncement: courseAnnouncementArr },
            { new: true, runValidators: true, useFindAndModify: true })


        const foundAuthor = await User.findById(author)
        const courseNameCode = `${foundCourse.name} (${foundCourse.code})`
        const notificationDetails = `of ${courseNameCode} course`

        //add notification
        const authorFullName = `${foundAuthor.firstName} ${foundAuthor.lastName}`
        const NotificationType = "course"
        const text = `${authorFullName} updated the announcements ${notificationDetails}`
        const newNotification = new Notification({ role: foundAuthor.role, text, type: NotificationType, refID: courseID })
        const savedNotification = await newNotification.save()

        //send the notification 
        const studentsArr = foundCourse.students
        const staffArr = foundCourse.staff

        for (const studentID of studentsArr) {
            if (studentID != author) {
                await User.findByIdAndUpdate(studentID, { $addToSet: { notifications: [savedNotification._id] } },
                    { new: true, runValidators: true, useFindAndModify: true })
            }

        }

        for (const staffID of staffArr) {
            if (staffID != author) {
                await User.findByIdAndUpdate(staffID, { $addToSet: { notifications: [savedNotification._id] } },
                    { new: true, runValidators: true, useFindAndModify: true })
            }

        }

        res.json(foundCourse.courseAnnouncement)
    } catch (error) {
        res.status(400).json(error)
    }


});

router.delete("/courseAnnouncements/delete", async (req, res) => {
    try {
        const { courseID, index, author } = req.body
        if (!courseID)
            return res.status(400).json("courseID is required");

        if (!index)
            return res.status(400).json("index is required");

        if (!author)
            return res.status(400).json("author is required");
        // const courseAnnouncementArr = (await Course.findById(courseID)).courseAnnouncement
        // courseAnnouncementArr[index] = newAnnouncement

        await Course.findByIdAndUpdate(courseID,
            // { $set: { edit : newAnnouncement } },
            { $unset: { [`courseAnnouncement.${index}`]: 1 } },
            { new: true, runValidators: true, useFindAndModify: true })

        const foundCourse = await Course.findByIdAndUpdate(courseID,
            // { $set: { edit : newAnnouncement } },
            { $pull: { "courseAnnouncement": null } },
            { new: true, runValidators: true, useFindAndModify: true })


        const foundAuthor = await User.findById(author)
        const courseNameCode = `${foundCourse.name} (${foundCourse.code})`
        const notificationDetails = `of ${courseNameCode} course`

        //add notification
        const authorFullName = `${foundAuthor.firstName} ${foundAuthor.lastName}`
        const NotificationType = "course"
        const text = `${authorFullName} updated the announcements ${notificationDetails}`
        const newNotification = new Notification({ role: foundAuthor.role, text, type: NotificationType, refID: courseID })
        const savedNotification = await newNotification.save()

        //send the notification 
        const studentsArr = foundCourse.students
        const staffArr = foundCourse.staff

        for (const studentID of studentsArr) {
            if (studentID != author) {
                await User.findByIdAndUpdate(studentID, { $addToSet: { notifications: [savedNotification._id] } },
                    { new: true, runValidators: true, useFindAndModify: true })
            }

        }

        for (const staffID of staffArr) {
            if (staffID != author) {
                await User.findByIdAndUpdate(staffID, { $addToSet: { notifications: [savedNotification._id] } },
                    { new: true, runValidators: true, useFindAndModify: true })
            }

        }

        res.json(foundCourse.courseAnnouncement)
    } catch (error) {
        res.status(400).json(error)
    }


});



module.exports = router;
