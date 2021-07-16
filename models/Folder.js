const mongoose = require("mongoose");

const folderSchema = mongoose.Schema({
    folderName: String,
    subFolders: [{ type: mongoose.Types.ObjectId, ref: "Folder" }],
    contents: [{ type: mongoose.Types.ObjectId, ref: "Content" }],
});

module.exports = mongoose.model("Folder", folderSchema);
