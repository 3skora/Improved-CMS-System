const mongoose = require("mongoose");
const moment = require("moment");

const discussionSchema = mongoose.Schema({
    author: {
        type: mongoose.Types.ObjectId,
        ref: "User",
    },
    text: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ["general", "content"]
    },
    //type == "general" ? typeID = courseID : typeID = contentID
    typeID: { type: mongoose.Schema.Types.ObjectId },

    // files: Object,
    likes: [{
        type: mongoose.Types.ObjectId,
        ref: "User",
    }],
    edited: {
        type: Boolean,
        default: false
    },
    date: {
        type: String,
        default: moment().format('llll')
    },
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],

});


module.exports = mongoose.model("Discussion", discussionSchema);
