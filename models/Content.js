const moment = require("moment")
const mongoose = require("mongoose");

const contentSchema = mongoose.Schema({
    tag: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    folderID: {
        type: mongoose.Types.ObjectId,
        ref: "Folder",
        required: true,
    },
    courseID: { type: mongoose.Types.ObjectId, ref: "Course", },
    discussion: [{ type: mongoose.Types.ObjectId, ref: "Discussion" }],
    file: Object,
    date: {
        type: String,
        default: moment().format('llll')
    },
    author: {
        type: mongoose.Types.ObjectId,
        ref: "User",
    },
});

module.exports = mongoose.model("Content", contentSchema);
