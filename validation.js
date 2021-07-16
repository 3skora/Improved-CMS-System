const Joi = require("joi")

module.exports.userValidation = data => {
    const schema = Joi.object({
        firstName: Joi.string().required(),
        lastName: Joi.string().required(),
        gucID: Joi.string().required(),
        email: Joi.string().required().email(),
        password: Joi.string(),
        role: Joi.string().required().valid("student", "admin", "staff"),
        courses: Joi.array().items(Joi.string())
    })

    return schema.validate(data);
}


module.exports.courseValidation = data => {
    const schema = Joi.object({
        name: Joi.string().required(),
        code: Joi.string().required(),
        department: Joi.string().required(),
        semester: Joi.string().required(),
        // students: Joi.array().items(Joi.string()),
        // staff: Joi.array().items(Joi.string()),
    })

    return schema.validate(data);
}
module.exports.assignCourseValidation = data => {
    const schema = Joi.object({
        courses: Joi.array().items(Joi.string()),
        users: Joi.array().items(Joi.string()),
    })

    return schema.validate(data);
}


module.exports.departmentValidation = data => {
    const schema = Joi.object({
        name: Joi.string().required(),
        courses: Joi.array().items(Joi.string()).required(),
    })

    return schema.validate(data);
}

module.exports.semesterValidation = data => {
    const schema = Joi.object({
        season: Joi.string().required().valid("Spring", 'Winter', 'Summer'),
        year: Joi.number().required(),
    })

    return schema.validate(data);
}

module.exports.contentValidation = data => {
    const schema = Joi.object({
        // tag: Joi.array().items(Joi.string()).required(),
        tag: Joi.string().required(),
        title: Joi.string().required(),
        // folderName: Joi.string(),
        courseID: Joi.string().required(),
        file: Joi.object().required(),
        date: Joi.string()
    })

    return schema.validate(data);
}

module.exports.discussionValidation = data => {
    const schema = Joi.object({
        ID: Joi.string().required(),
        author: Joi.string().required(),
        text: Joi.string().required(),
        likes: Joi.number(),
        date: Joi.string(),
        type: Joi.string().valid("general", 'content').required(),
        comments: Joi.array().items(Joi.string()),
    })

    return schema.validate(data);
}

module.exports.commentValidation = data => {
    const schema = Joi.object({
        author: Joi.string().required(),
        text: Joi.string().required(),
        postID: Joi.string().required(),
    })

    return schema.validate(data);
}

module.exports.loginValidation = data => {
    const schema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().required()
    })

    return schema.validate(data);
}