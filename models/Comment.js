const mongoose = require("mongoose");
const moment = require("moment")

const commentSchema = mongoose.Schema({
    author: {
        type: mongoose.Types.ObjectId,
        ref: "User",
    },
    text: {
        type: String,
        required: true
    },
    // files: Object,
    likes: [{
        type: mongoose.Types.ObjectId,
        ref: "User",
    }],
    date: {
        type: String,
        default: moment().format('llll')
    },
    edited: {
        type: Boolean,
        default: false
    },
    postID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Discussion",
        required: true
    },
    replies: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
    }]

});

module.exports = mongoose.model("Comment", commentSchema);