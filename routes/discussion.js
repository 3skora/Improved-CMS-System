const express = require("express");
const router = express.Router();
const moment = require("moment")
const User = require("../models/User")
const Content = require("../models/Content")
const Course = require("../models/Course")
const Discussion = require("../models/Discussion")
const Notification = require("../models/Notification")
const Comment = require("../models/Comment")
const { authStaff, authStudent, authAdmin, auth } = require("../auth");

const { deleteComment, DiscussionCourseHelper, DiscussionContentHelper, deleteDiscussion }
    = require("../helpers")

const { discussionValidation, commentValidation } = require("../validation");
// "/content/:contentID" => type = content
// "/general/:courseID" => type = general
router.get("/:discussionID", async (req, res) => {
    try {
        const { discussionID } = req.params
        const foundDiscussion = await Discussion.findById(discussionID)
            .populate("author")
        if (!foundDiscussion)
            return res.status(400).json(`Discussion ${discussionID} not found`);
        // .populate({
        //     path: 'discussion',
        //     populate: { path: 'author' }
        // });
        // .populate("semester")
        // .populate("rootFolder", "folderName")
        // .populate({
        //     path: 'rootFolder',
        //     populate: { path: 'subFolders' }
        // });
        res.json(foundDiscussion)
    } catch (error) {
        res.status(400).json(error)
    }
});

router.get("/content/:contentID", auth, async (req, res) => {
    try {
        const { contentID } = req.params
        const data = (await Content.findById(contentID)).discussion
        res.send(data)
    } catch (error) {
        console.log(error)
        return res.status(400).json(error.details[0].message);
    }

});

router.get("/users/:userID", async (req, res) => {
    try {
        const { userID } = req.params
        const foundUser = await User.findById(userID)
        if (!foundUser)
            return res.status(400).json(`user ${userID} not found`);
        let result = [];
        for (const courseID of foundUser.courses) {
            const courseDetails = await Course.findById(courseID, { discussion: 1, name: 1, _id: 1, code: 1 })
            // .populate({
            //     path: 'discussion',
            //     populate: { path: 'author' }
            // });
            // .populate("semester")
            // .populate("rootFolder", "folderName")
            // .populate({
            //     path: 'rootFolder',
            //     populate: { path: 'subFolders' }
            // });

            result.push(courseDetails)
        }
        res.json(result)
    } catch (error) {
        res.status(400).json(error)
    }

});


router.get("/users/activities/:userID", async (req, res) => {
    try {
        const { userID } = req.params
        const foundUser = await User.findById(userID)
        if (!foundUser)
            return res.status(400).json(`user ${userID} not found`);

        res.json(foundUser.activities)
    } catch (error) {
        res.status(400).json(error)
    }

});

//localhost:8080/discussion/60c5bb45cf8bd0281c189758/
router.post("/", async (req, res) => {
    try {
        const { error } = discussionValidation({ ...req.body });
        if (error)
            return res.status(400).json(error.details[0].message);
        //check Author in Users DB
        const { author, type, ID } = req.body
        const foundAuthor = await User.findById(author)
        if (!foundAuthor)
            return res.status(400).json("Author not found");

        //check course in Courses DB
        let foundCourse;
        let foundContent;
        let courseID;
        let courseNameCode;
        let contentTitle;
        let notificationDetails;
        if (type == "general") {
            courseID = ID
            foundCourse = await Course.findById(ID)
            if (!foundCourse)
                return res.status(400).json(`Course ${ID} not found`);
            courseNameCode = `${foundCourse.name} (${foundCourse.code})`
            notificationDetails = `about ${courseNameCode} course`
        }
        //check Content in Contents DB
        if (type == "content") {
            foundContent = await Content.findById(ID)
            if (!foundContent)
                return res.status(400).json(`Content ${ID} not found`);
            courseID = foundContent.courseID
            contentTitle = foundContent.title

            foundCourse = await Course.findById(courseID)
            if (!foundCourse)
                return res.status(400).json(`Course ${courseID} not found`);
            courseNameCode = `${foundCourse.name} (${foundCourse.code})`
            notificationDetails = `about ${contentTitle} in ${courseNameCode} course`
        }

        //save discussion in DB
        const newDiscussion = new Discussion({ ...req.body, typeID: ID });
        const savedDiscussion = await newDiscussion.save();

        //add discussion to course array
        if (type == "general")
            DiscussionCourseHelper(foundCourse._id, savedDiscussion._id, "insert")

        //add discussion to course array and content array
        if (type == "content") {
            const { courseID } = foundContent
            DiscussionContentHelper(foundContent._id, savedDiscussion._id, "insert")
            DiscussionCourseHelper(courseID, savedDiscussion._id, "insert")
        }

        //add discussion to activities array
        await User.findByIdAndUpdate(author, { $addToSet: { activities: [savedDiscussion._id] } },
            { new: true, runValidators: true, useFindAndModify: true })



        //add notification
        const authorFullName = `${foundAuthor.firstName} ${foundAuthor.lastName}`
        const NotificationType = "discussion"
        const text = `${authorFullName} added a new discussion ${notificationDetails}`
        const refID = savedDiscussion._id
        const newNotification = new Notification({ role: foundAuthor.role, text, type: NotificationType, refID })
        const savedNotification = await newNotification.save()

        //send the notification 
        const courseData = await Course.findById(courseID)
        const studentsArr = courseData.students
        const staffArr = courseData.staff

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


        res.json(savedDiscussion);
    } catch (err) {
        console.log("catch error")
        console.log(err)
        if (err.driver && err.name == "MongoError" && err.keyValue)
            res.json(`${err.keyValue.code} already exists`)
        res.json(err);
    }
});

router.patch("/like/:postID/:userID", async (req, res) => {
    try {

        //check Post in Discussion DB
        const { postID, userID } = req.params
        const foundPost = await Discussion.findById(postID)
        if (!foundPost)
            return res.status(400).json("Post not found");

        const foundUser = await User.findById(userID)
        if (!foundUser)
            return res.status(400).json(`user ${userID} not found`);


        const updatedPost = await Discussion.findByIdAndUpdate(postID, { $addToSet: { likes: [userID] } },
            { new: true, runValidators: true, useFindAndModify: true })
        res.json(updatedPost)
    } catch (err) {
        console.log("catch error")
        console.log(err)
        if (err.driver && err.name == "MongoError" && err.keyValue)
            res.json(`${err.keyValue.code} already exists`)
        res.json(err);
    }
});


router.patch("/unlike/:postID/:userID", async (req, res) => {
    try {

        //check Post in Discussion DB
        const { postID, userID } = req.params
        const foundPost = await Discussion.findById(postID)
        if (!foundPost)
            return res.status(400).json("Post not found");

        const foundUser = await User.findById(userID)
        if (!foundUser)
            return res.status(400).json(`user ${userID} not found`);


        const newLikesArr = foundPost.likes.filter(el => el != userID)
        const updatedPost = await Discussion.findByIdAndUpdate(postID, { likes: newLikesArr },
            { new: true, runValidators: true, useFindAndModify: true })
        res.json(updatedPost)
    } catch (err) {
        console.log("catch error")
        console.log(err)
        if (err.driver && err.name == "MongoError" && err.keyValue)
            res.json(`${err.keyValue.code} already exists`)
        res.json(err);
    }
});


router.patch("/:postID", auth, async (req, res) => {
    try {
        const newText = req.body.newText;

        //check Post in Discussion DB
        const { postID } = req.params
        const foundPost = await Discussion.findById(postID)
        if (!foundPost)
            return res.status(400).json("Post not found");

        const updatedPost = await Discussion.findByIdAndUpdate(postID, { text: newText, edited: true, date: moment().format('llll') },
            { new: true, runValidators: true, useFindAndModify: true })
        res.json(updatedPost)
    } catch (err) {
        console.log("catch error")
        console.log(err)
        if (err.driver && err.name == "MongoError" && err.keyValue)
            res.json(`${err.keyValue.code} already exists`)
        res.json(err);
    }
});

router.delete("/:postID/:userID", async (req, res) => {
    try {
        //check Post in Discussion DB
        const { postID, userID } = req.params

        if (!userID)
            return res.status(400).json("userID is required");
        const foundPost = await Discussion.findById(postID)
        if (!foundPost)
            return res.status(400).json("Post not found");

        const activities = (await User.findById(userID)).activities
        const newActivitiesArr = activities.filter(el => el != postID)
        await User.findByIdAndUpdate(userID, { activities: newActivitiesArr },
            { new: true, runValidators: true, useFindAndModify: true })
        deleteDiscussion(postID)
        res.send("discussion deleted")

    } catch (err) {
        console.log("catch error")
        console.log(err)
        if (err.driver && err.name == "MongoError" && err.keyValue)
            res.json(`${err.keyValue.code} already exists`)
        res.json(err);
    }
});


//=======================Comments=========================


router.get("/comments/:commentID", async (req, res) => {
    try {
        const { commentID } = req.params
        const foundComment = await Comment.findById(commentID)
            .populate("author")
        if (!foundComment)
            return res.status(400).json(`Comment ${commentID} not found`);
        // .populate({
        //     path: 'Comment',
        //     populate: { path: 'author' }
        // });
        // .populate("semester")
        // .populate("rootFolder", "folderName")
        // .populate({
        //     path: 'rootFolder',
        //     populate: { path: 'subFolders' }
        // });
        res.json(foundComment)
    } catch (error) {
        res.status(400).json(error)
    }
});

//localhost:8080/discussion/60c5bf7f03311841d8e8e532/comments4
router.post("/:postID/comments", async (req, res) => {
    try {
        const { error } = commentValidation(req.body);
        if (error) {
            return res.status(400).json(error.details[0].message);
        }
        //check Post in Discussion DB
        const { postID } = req.params
        const foundPost = await Discussion.findById(postID)
        if (!foundPost)
            return res.status(400).json("Post not found");

        //what is the req.user.id ??!! 
        //men el sanay3y el kan sha3'al hena
        const newComment = new Comment({ postID, ...req.body });
        const savedComment = await newComment.save();
        // res.send("done")
        foundPost.comments.push(savedComment._id)
        const newPost = await Discussion.findByIdAndUpdate(postID, { comments: foundPost.comments },
            { new: true, runValidators: true, useFindAndModify: true })

        //add discussion to activities array ??????????????
        // await User.findByIdAndUpdate(savedComment.author, { $addToSet: { activities: [postID] } })


        //add notification
        const commentAuthor = await User.findById(req.body.author)
        const authorFullName = `${commentAuthor.firstName} ${commentAuthor.lastName}`
        const NotificationType = "discussion"
        const text = `${authorFullName} commented on your discussion '${foundPost.text}'`
        const refID = postID
        const discussionAuthor = foundPost.author

        //send the notification 
        if (discussionAuthor != req.body.author) {
            const newNotification = new Notification({ role: commentAuthor.role, text, type: NotificationType, refID })
            const savedNotification = await newNotification.save()
            await User.findByIdAndUpdate(discussionAuthor, { $addToSet: { notifications: [savedNotification._id] } },
                { new: true, runValidators: true, useFindAndModify: true })

        }


        res.json(savedComment);
    } catch (err) {
        console.log("catch error")
        console.log(err)
        if (err.driver && err.name == "MongoError" && err.keyValue)
            res.json(`${err.keyValue.code} already exists`)
        res.json(err);
    }
});

router.patch("/:postID/comments/:commentID", auth, async (req, res) => {
    try {
        const { newText } = req.body;
        const { commentID, postID } = req.params
        const foundComment = await Comment.findById(commentID)
        if (!foundComment)
            return res.status(400).json("Comment not found");

        const editedComment = await Comment.findByIdAndUpdate(commentID, { text: newText, edited: true, date: moment().format('llll') },
            { new: true, runValidators: true, useFindAndModify: true })
        res.json(editedComment);
    } catch (err) {
        console.log("catch error")
        console.log(err)
        if (err.driver && err.name == "MongoError" && err.keyValue)
            res.json(`${err.keyValue.code} already exists`)
        res.json(err);
    }
});

router.delete("/:postID/comments/:commentID", async (req, res) => {
    try {
        const { commentID, postID, userID } = req.params

        const foundComment = await Comment.findById(commentID)
        if (!foundComment)
            return res.status(400).json("Comment not found");

        //check Post in Discussion DB
        const foundPost = await Discussion.findById(postID)
        if (!foundPost)
            return res.status(400).json("Post not found");

        // const activities = (await User.findById(userID)).activities
        // const newActivitiesArr = activities.filter(el => el != postID)
        // await User.findByIdAndUpdate(userID, { activities: newActivitiesArr },
        //     { new: true, runValidators: true, useFindAndModify: true })
        deleteComment(commentID)
        res.send("comment deleted")

    } catch (err) {
        console.log("catch error")
        console.log(err)
        if (err.driver && err.name == "MongoError" && err.keyValue)
            res.json(`${err.keyValue.code} already exists`)
        res.json(err);
    }
});

router.patch("/likeComment/:commentID/:userID", async (req, res) => {
    try {

        //check Post in Discussion DB
        const { commentID, userID } = req.params
        const foundComment = await Comment.findById(commentID)
        if (!foundComment)
            return res.status(400).json("Comment not found");

        const foundUser = await User.findById(userID)
        if (!foundUser)
            return res.status(400).json(`user ${userID} not found`);


        const updatedComment = await Comment.findByIdAndUpdate(commentID, { $addToSet: { likes: [userID] } },
            { new: true, runValidators: true, useFindAndModify: true })
        res.json(updatedComment)
    } catch (err) {
        console.log("catch error")
        console.log(err)
        if (err.driver && err.name == "MongoError" && err.keyValue)
            res.json(`${err.keyValue.code} already exists`)
        res.json(err);
    }
});


router.patch("/unlikeComment/:commentID/:userID", async (req, res) => {
    try {

        //check Post in Discussion DB
        const { commentID, userID } = req.params
        const foundComment = await Comment.findById(commentID)
        if (!foundComment)
            return res.status(400).json("Comment not found");

        const foundUser = await User.findById(userID)
        if (!foundUser)
            return res.status(400).json(`user ${userID} not found`);


        const newLikesArr = foundComment.likes.filter(el => el != userID)
        const updatedComment = await Comment.findByIdAndUpdate(commentID, { likes: newLikesArr },
            { new: true, runValidators: true, useFindAndModify: true })
        res.json(updatedComment)
    } catch (err) {
        console.log("catch error")
        console.log(err)
        if (err.driver && err.name == "MongoError" && err.keyValue)
            res.json(`${err.keyValue.code} already exists`)
        res.json(err);
    }
});



//===========================Replies======================

router.post("/:commentID/reply", async (req, res) => {
    try {
        const { error } = commentValidation(req.body);
        if (error) {
            return res.status(400).json(error.details[0].message);
        }
        //check Post in Discussion DB
        const { postID } = req.body
        const { commentID } = req.params
        const foundComment = await Comment.findById(commentID)
        const foundPost = await Discussion.findById(postID)
        if (!foundPost)
            return res.status(400).json("Post not found");

        const newReply = new Comment({ ...req.body });
        const savedReply = await newReply.save();
        // res.send("done")

        const newPost = await Comment.findByIdAndUpdate(commentID, { $addToSet: { replies: [savedReply._id] } },
            { new: true, runValidators: true, useFindAndModify: true })

        //add discussion to activities array 
        await User.findByIdAndUpdate(savedReply.author, { $addToSet: { activities: [postID] } },
            { new: true, runValidators: true, useFindAndModify: true })



        //add notification
        const replyAuthor = await User.findById(req.body.author)
        const authorFullName = `${replyAuthor.firstName} ${replyAuthor.lastName}`
        const NotificationType = "discussion"
        const text = `${authorFullName} replied to your comment '${foundComment.text}'`

        const textForDiscussionAuthor = `${authorFullName} replied to a comment in your discussion '${foundPost.text}'`
        const refID = postID
        const commentAuthor = foundComment.author
        const discussionAuthor = foundPost.author

        //send the notification to comment author
        if (commentAuthor != req.body.author) {
            const newNotification = new Notification({ role: replyAuthor.role, text, type: NotificationType, refID })
            const savedNotification = await newNotification.save()
            await User.findByIdAndUpdate(commentAuthor, { $addToSet: { notifications: [savedNotification._id] } },
                { new: true, runValidators: true, useFindAndModify: true })

        }

        //send the notification to discussion author
        if (discussionAuthor != req.body.author) {
            const newNotification2 = new Notification({ role: replyAuthor.role, text: textForDiscussionAuthor, type: NotificationType, refID })
            const savedNotification2 = await newNotification2.save()
            await User.findByIdAndUpdate(discussionAuthor, { $addToSet: { notifications: [savedNotification2._id] } },
                { new: true, runValidators: true, useFindAndModify: true })

        }

        res.json(savedReply);
    } catch (err) {
        console.log("catch error")
        console.log(err)
        if (err.driver && err.name == "MongoError" && err.keyValue)
            res.json(`${err.keyValue.code} already exists`)
        res.json(err);
    }
});

router.delete("/comments/:commentID/:replyID", async (req, res) => {
    try {
        const { commentID, replyID } = req.params
        const foundComment = await Comment.findById(commentID)
        if (!foundComment)
            return res.status(400).json("Comment not found");


        //Delete reply from commentReplies and update [comment.replies] 
        const updatedReplies = foundComment.replies.filter(r => r != replyID)
        const updatedPost = await Comment.findByIdAndUpdate(commentID, { replies: updatedReplies },
            { new: true, runValidators: true, useFindAndModify: true })
        const deletedReply = await Comment.findByIdAndDelete(replyID, { useFindAndModify: true })

        res.send("comment deleted")

    } catch (err) {
        console.log("catch error")
        console.log(err)
        if (err.driver && err.name == "MongoError" && err.keyValue)
            res.json(`${err.keyValue.code} already exists`)
        res.json(err);
    }
});


module.exports = router;
