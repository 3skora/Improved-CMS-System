const express = require("express");
const router = express.Router();
const User = require("../models/User")
const Notification = require("../models/Notification")
const { auth } = require("../auth");

router.get("/:notificationID", async (req, res) => {
    try {
        const { notificationID } = req.params
        const foundNotification = await Notification.findById(notificationID)
        if (!foundNotification)
            return res.status(400).json(`Notification ${notificationID} not found`);

        console.log("test github => ", foundNotification)
        res.send(foundNotification)
    }
    catch (err) {
        res.json(err);
    }
});

router.get("/all/:userID", async (req, res) => {
    try {
        const { userID } = req.params
        let courseNotifications = [];
        let discussionNotifications = [];
        const foundUser = await User.findById(userID)
        if (!foundUser)
            return res.status(400).json(`User ${userID} not found`);

        for (const notificationID of foundUser.notifications) {
            const foundNotification = await Notification.findById(notificationID)
            if (foundNotification.type === "course")
                courseNotifications.push(notificationID)

            if (foundNotification.type === "discussion")
                discussionNotifications.push(notificationID)
        }

        let result = { all: foundUser.notifications, courseNotifications, discussionNotifications }

        res.send(result)
    }
    catch (err) {
        console.log("catch error")
        res.json(err);
    }
});


module.exports = router;