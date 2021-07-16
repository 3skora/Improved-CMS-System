const express = require("express")
const app = express();
const port = 8080;
const cors = require("cors")

const User = require("./models/User");
const Content = require("./models/Content");
const { loginValidation } = require("./validation");
const { authStaff, authStudent, authAdmin } = require("./auth");
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

//multer
// const multer = require('multer')
// const { storage } = require("./cloudinary")
// const upload = multer({ storage })
//=================================

if (process.env.NODE_ENV !== "production") {
    const dotenv = require("dotenv")
    dotenv.config()
}

const mongoose = require("mongoose")
const connectionParams = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: true,
    useCreateIndex: true
};
mongoose.connect(process.env.urlDB, connectionParams)
    .then(() => console.log("DB CONNECTED!!!"))
    .catch(() => console.log("DB FAILED !!!!"))

//middle ware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())
// app.use(express.static("/client/public/uploads/"))

//Import Routes
const userRoute = require("./routes/users")
app.use("/users", userRoute)

const courseRoute = require("./routes/courses")
app.use("/courses", courseRoute)

const departmentRoute = require("./routes/departments")
app.use("/departments", departmentRoute)

const semesterRoute = require("./routes/semesters")
app.use("/semesters", semesterRoute)

const contentRoute = require("./routes/content")
app.use("/contents", contentRoute)

const discussionRoute = require("./routes/discussion");
app.use("/discussion", discussionRoute)

const notificationRoute = require("./routes/notification");
app.use("/notifications", notificationRoute)


//Routes
app.get("/search?", async (req, res) => {
    try {
        const { q } = req.query
        const x1 = q.trim().replace(/ +/gi, "_")
        const x2 = q.trim().replace(/ +/gi, "")
        const regex1 = new RegExp(x1, "gi")
        const regex2 = new RegExp(x2, "gi")
        const regex = new RegExp(q, "gi")
        const regexAny = new RegExp(`[${q}]`, "gi")
        const regexNum = /0-9/
        const result = await Content.find({
            $or: [{ tag: regex1 },
            { tag: regex2 },
            { title: regex },
            ]
        })
        res.json(result)
    } catch (error) {
        res.json(error)

    }
})

app.post('/login', async (req, res) => {
    try {
        const { error } = loginValidation(req.body);
        if (error) return res.status(400).json(error.details[0].message);

        const foundUser = await User.findOne({ email: req.body.email });
        if (!foundUser) return res.status(400).send("Email not found");

        const isMatched = await bcrypt.compare(req.body.password, foundUser.password);
        if (!isMatched) return res.status(400).send("Incorrect Password");

        req.header.token = jwt.sign({ id: foundUser._id, role: foundUser.role }, process.env.tokenSecret);
        res.json({
            user: foundUser,
            token: req.header.token
        })
    } catch (err) {
        res.json(err);
    }
});


app.listen(port, () => {
    console.log(`listening on port ${port}`)
})