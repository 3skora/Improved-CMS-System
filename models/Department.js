const mongoose = require("mongoose");

const departmentSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    courses: [{ type: mongoose.Types.ObjectId, ref: "Course" }],
});

module.exports = mongoose.model("Department", departmentSchema);
