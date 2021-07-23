const mongoose = require("mongoose");

const courseSchema = mongoose.Schema({
    name: String,
    code: {
        type: String,
        unique: true,
    },
    courseAnnouncement: [String],
    department: {
        type: mongoose.Types.ObjectId,
        ref: "Department",
        required: true,
    },
    semester: {
        type: mongoose.Types.ObjectId,
        ref: "Semester",
        required: true,
    },
    students: [{
        type: mongoose.Types.ObjectId,
        ref: "User",
        // required: true,
    }],
    staff: [{
        type: mongoose.Types.ObjectId,
        ref: "User",
        // required: true,
    }],
    content: [{
        type: mongoose.Types.ObjectId,
        ref: "Content"
    }],

    discussion: [{ type: mongoose.Types.ObjectId, ref: "Discussion" }],
    rootFolder: {
        type: mongoose.Types.ObjectId,
        ref: "Folder"
    },

});

module.exports = mongoose.model("Course", courseSchema);
