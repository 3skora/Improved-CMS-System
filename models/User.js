const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  firstName: String,
  lastName: String,
  gucID: {
    type: String,
    unique: true,
  },
  email: {
    type: String,
    unique: true,
  },
  password: {
    type: String,
    default: "123456",
  },
  role: String,
  courses: [{ type: mongoose.Types.ObjectId, ref: "Course" }],
  activities: [{ type: mongoose.Types.ObjectId, ref: "Discussion" }],
  departmentID: {
    type: mongoose.Types.ObjectId,
    ref: "Department",
  },

  notifications: [{
    type: mongoose.Types.ObjectId,
    ref: "Notification",
  }],
});

userSchema.virtual('fullName').get(function () {
  return this.name.first + ' ' + this.name.last;
});

module.exports = mongoose.model("User", userSchema);
