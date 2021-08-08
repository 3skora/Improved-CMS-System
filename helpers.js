const Department = require("./models/Department")
const Course = require("./models/Course")
const Content = require("./models/Content")
const Discussion = require("./models/Discussion")
const Comment = require("./models/Comment")
const Folder = require("./models/Folder")
const User = require("./models/User")

// const { cloudinary } = require("./cloudinary")
const fs = require('fs')
const deleteComment = async (commentID) => {
    const postID = (await Comment.findById(commentID)).postID
    const foundPost = await Discussion.findById(postID)

    //Delete comment from discussion and update [discussion.comments] 
    const updatedComments = foundPost.comments.filter(c => c != commentID)
    const updatedPost = await Discussion.findByIdAndUpdate(postID, { comments: updatedComments },
        { new: true, runValidators: true, useFindAndModify: true })

    //Delete Comment from comments DB
    const deletedComment = await Comment.findByIdAndDelete(commentID, { useFindAndModify: true })
}

const DiscussionCourseHelper = async (courseID, discussionID, operation) => {
    const foundPost = await Discussion.findById(discussionID)
    const foundCourse = await Course.findById(courseID)
    if (operation == "insert") {
        foundCourse.discussion.push(discussionID)
        await Course.findByIdAndUpdate(courseID, { discussion: foundCourse.discussion },
            { new: true, runValidators: true, useFindAndModify: true })
    }

    if (operation == "delete") {
        const newDiscussionArr = foundCourse.discussion.filter(el => el.toString() != discussionID.toString())
        await Course.findByIdAndUpdate(courseID, { discussion: newDiscussionArr },
            { new: true, runValidators: true, useFindAndModify: true })
    }
}
const DiscussionContentHelper = async (contentID, discussionID, operation) => {
    const foundPost = await Discussion.findById(discussionID)
    const foundContent = await Content.findById(contentID)
    if (operation == "insert") {
        foundContent.discussion.push(discussionID)
        await Content.findByIdAndUpdate(contentID, { discussion: foundContent.discussion },
            { new: true, runValidators: true, useFindAndModify: true })
    }

    if (operation == "delete") {
        const newDiscussionArr = foundContent.discussion.filter(el => el != discussionID)
        await Content.findByIdAndUpdate(contentID, { discussion: newDiscussionArr },
            { new: true, runValidators: true, useFindAndModify: true })
    }
}

const deleteDiscussion = async (discussionID) => {
    const foundPost = await Discussion.findById(discussionID)
    //delete discussion from course array
    if (foundPost.type == "general")
        DiscussionCourseHelper(foundPost.typeID, discussionID, "delete")

    //delete discussion from course array and content array
    if (foundPost.type == "content") {
        const foundContent = await Content.findById(foundPost.typeID)
        const { courseID } = foundContent
        await DiscussionCourseHelper(courseID, discussionID, "delete")
        await DiscussionContentHelper(foundPost.typeID, discussionID, "delete")
    }
    //delete comments
    for (let c of foundPost.comments) {
        await Comment.findByIdAndDelete(c, { useFindAndModify: true })
    }
    //Delete discussion from activities
    const activities = (await User.findById(foundPost.author)).activities
    const newActivitiesArr = activities.filter(el => el != discussionID)
    await User.findByIdAndUpdate(foundPost.author, { activities: newActivitiesArr },
        { new: true, runValidators: true, useFindAndModify: true })

    //Delete discussion itself from discussions DB
    const deletedDiscussion = await Discussion.findByIdAndDelete(discussionID, { useFindAndModify: true })
}

const deleteContent = async (contentID, folderID) => {
    const foundContent = await Content.findById(contentID)
    const { courseID, discussion, file } = foundContent

    //delete all discussions from [content.discussion]
    for (let discussionID of discussion) {
        await deleteDiscussion(discussionID)
    }

    //delete content from [course.content] and update it with the new array
    const foundCourse = await Course.findById(courseID)
    const newContentArr = foundCourse.content.filter(el => el != contentID)
    await Course.findByIdAndUpdate(courseID, { content: newContentArr },
        { new: true, runValidators: true, useFindAndModify: true })

    //delete content from [folder.contents] and update the folder with the new array
    const foundFolder = await Folder.findById(folderID)
    const newContentsArr = foundFolder.contents.filter(el => el != contentID)
    await Folder.findByIdAndUpdate(folderID, { contents: newContentsArr },
        { new: true, runValidators: true, useFindAndModify: true })



    //Delete Content itself from Contents DB
    const deletedContent = await Content.findByIdAndDelete(contentID, { useFindAndModify: true })

    //Delete Content itself from storage
    fs.unlinkSync(file.path)
}

const deleteCourse = async (courseID) => {
    let foundCourse = await Course.findById(courseID)
    const { department, content } = foundCourse


    //delete course from [department.courses] and update it with the new array
    const foundDepartment = await Department.findById(department)
    const newCoursesArr = foundDepartment.courses.filter(el => el != courseID)
    await Department.findByIdAndUpdate(department, { courses: newCoursesArr },
        { new: true, runValidators: true, useFindAndModify: true })

    //delete all contents from [course.content]
    for (let contentID of content) {
        await deleteContent(contentID)
    }

    //delete all discussions from [content.discussion]
    // here we construct [discussion] because prev. loop does changes to [discussion]
    foundCourse = await Course.findById(courseID)
    const { discussion } = foundCourse
    for (let discussionID of discussion) {
        await deleteDiscussion(discussionID)
    }
    //Delete course itself from Courses DB
    const deletedCourse = await Course.findByIdAndDelete(courseID, { useFindAndModify: true })
}

const deleteDepartment = async (departmentID) => {
    const foundDepartment = await Department.findById(departmentID)
    const { courses } = foundDepartment

    //delete all courses from [department.courses]
    for (let courseID of courses) {
        await deleteContent(courseID)
    }
    //Delete Department itself from Departments DB
    const deletedCourse = await Department.findByIdAndDelete(departmentID, { useFindAndModify: true })
}

const tagHelper = (tag) => {
    let arr = tag.split(",")
    let result = [];
    for (const item of arr) {
        let x = item.trim().replace(/ +/g, "_")
        if (x.charAt(0) !== "#")
            x = `#${x}`
        result.push(x)
    }
    return result.join(", ")
}


let getAllBelow = (folderID) => {
    Folder.findById(folderID)
        .then(folderData => {

            if (folderData.subFolders.length === 0) {
                console.log("deleted result => ", result)
                return result
            }

            else {
                for (let index = 0; index < folderData.subFolders.length; index++) {
                    const element = folderData.subFolders[index];
                    result.push(element)
                    return getAllBellow(element)
                }
            }
        })
        .catch(err => console.log(err))
}

let result = []
let recursivelyDelete = (folderID) => {
    let item
    let temp = []
    return Folder.findById(folderID)
        .then(folderData => {
            item = folderData

            if (item.subFolders.length !== 0) {
                for (let index = 0; index < item.subFolders.length; index++) {
                    const element = item.subFolders[index];
                    result.push(element)
                    return recursivelyDelete(element)
                }
            }

            else {
                temp = result
                result = []
                return temp
            }

        })
}

let deleteFolderContents = async (folderID) => {

    const data = await Folder.findById(folderID)
    for (const contentID of data.contents) {
        await deleteContent(contentID, folderID)
    }


    await Folder.findByIdAndDelete(folderID)
}
module.exports = {
    deleteComment, DiscussionCourseHelper, DiscussionContentHelper,
    deleteDiscussion, deleteContent, deleteCourse, deleteDepartment, tagHelper,
    getAllBelow, recursivelyDelete, deleteFolderContents
}