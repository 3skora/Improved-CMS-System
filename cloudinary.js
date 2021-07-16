const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const Course = require("./models/Course")


cloudinary.config({
    cloud_name: process.env.cloudName,
    api_key: process.env.apiKey,
    api_secret: process.env.apiSecret
})

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: async (req, res) => {
            const { courseID } = req.params
            const course = await Course.findById(courseID)
                .populate("department", "name")
                .populate("semester")
            const defaultPath =
                `CMS/${course.semester.season}-${course.semester.year}/${course.department.name}/${course.name}`
            //defaultPath = CMS/Spring-2021/MET/Microprocessor
            if (!course)
                return 'CMS'

            if (req.body.folderName)
                return `${defaultPath}/${req.body.folderName}`
            else
                return defaultPath
        },
    },
});

module.exports = { cloudinary, storage }