const mongoose = require("mongoose");

const semesterSchema = mongoose.Schema({
    season: String,
    year: Number,
});

module.exports = mongoose.model("Semester", semesterSchema);
