const mongoose = require("mongoose");
const moment = require("moment");

const notificationSchema = mongoose.Schema({
    text: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        enum: ["course", "discussion"]
    },
    date: {
        type: String,
        default: moment().format('llll')
    },
    refID: { type: mongoose.Types.ObjectId },
});

module.exports = mongoose.model("Notification", notificationSchema);
