const express = require("express");
const router = express.Router();
const User = require("../models/User")
const Discussion = require("../models/Discussion")
const Comment = require("../models/Comment")
const { authStaff, authStudent, authAdmin, auth } = require("../auth");
const { deleteComment } = require("../helpers")
const { commentValidation } = require("../validation");


router.post("/:postID", auth, async (req, res) => {
    try {
        const { error } = commentValidation(req.body);
        if (error)
            return res.status(400).json(error.details[0].message);


        //check course in courses DB
        const { postID } = req.params
        const foundDiscussion = await Discussion.findById(postID)
        if (!foundDiscussion)
            return res.status(400).json(`Discussion ${postID} not found`);

        //save content in DB
        const newComment = new Comment({ postID, author: req.user.id, ...req.body })
        const savedComment = await newComment.save()

        //add Comment to Discussion array
        foundDiscussion.comments.push(savedComment._id)
        await Discussion.findByIdAndUpdate(postID, { comments: foundDiscussion.comments },
            { new: true, runValidators: true, useFindAndModify: true })
        res.send(savedComment)
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


router.patch("/:commentID", auth, async (req, res) => {
    try {
        const newText = req.body.text;
        const { commentID } = req.params
        const foundComment = await Comment.findById(commentID)
        if (!foundComment)
            return res.status(400).json("Comment not found");

        const updatedComment = await Comment.findByIdAndUpdate(commentID, { text: newText, edited: true, date: moment().format('llll') },
            { new: true, runValidators: true, useFindAndModify: true })
        res.json(updatedComment)

    } catch (err) {
        console.log("catch error", err)
        res.json(err);
    }
});
router.delete("/:commentID", auth, async (req, res) => {
    try {
        const { commentID } = req.params
        const foundComment = await Comment.findById(commentID)
        if (!foundComment)
            return res.status(400).json("Comment not found");

        deleteComment(commentID)
        res.send("comment deleted");

    } catch (err) {
        console.log("catch error", err)
        res.json(err);
    }
});