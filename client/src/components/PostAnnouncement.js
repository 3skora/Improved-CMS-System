import React, { useState, useEffect } from 'react'
import axios from "axios";
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import FormControl from '@material-ui/core/FormControl';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import Switch from '@material-ui/core/Switch';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import TextEditor from './TextEditor'

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStyles = makeStyles((theme) => ({
    form: {
        display: 'flex',
        flexDirection: 'column',
        margin: 'auto',
        width: 'fit-content',
    },
    formControl: {
        marginTop: theme.spacing(2),
        minWidth: 120,
    },
    formControlLabel: {
        marginTop: theme.spacing(1),
    },
    title: {
        flexGrow: 1,
        display: 'none',
        [theme.breakpoints.up('sm')]: {
            display: 'block',
        },
    },
}));

const PostAnnouncement = () => {

    const classes = useStyles();
    const [open, setOpen] = useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };


    const handleSelectedCourseChange = (e) => {
        console.log(e.target)
        setSelectedCourse(e.target.value);
        console.log(selectedCourse)
    };


    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpen(false);
    };


    const [text, setText] = useState("");
    const [allCourses, setAllCourses] = useState("");
    const [selectedCourse, setSelectedCourse] = useState("");


    const token = localStorage.getItem('token')
    const author = localStorage.getItem('userID')


    const auth = {
        headers: { token }
    }

    const loadData = async () => {
        try {
            const res = await axios.get(`http://localhost:8080/discussion/users/${author}`, auth)
            setAllCourses(res.data)

        } catch (err) {
            console.log(err.response.data)
        }
    }

    useEffect(() => {
        loadData()
    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = { newAnnouncement: text, author, courseID: selectedCourse };
        console.log("🚀 ~ file: PostDiscussion.js ~ line 94 ~ handleSubmit ~ formData", formData)
        try {
            await axios.post("http://localhost:8080/courses/courseAnnouncements", formData, auth)
            setText("")
            setSelectedCourse("")
            setOpen(true)
        } catch (error) {
            console.log(error.response.data)
        }
    };

    const onEditorChange = (value) => {
        setText(value)
    }

    const handleChange = (value) => {
        setText(value)
    }
    return (
        <div className="container" style={{ margin: "auto 150px", alignItems: 'center' }}>
            <form onSubmit={handleSubmit}>
                <div class="app">
                    <TextEditor
                        align="center"
                        value={text}
                        onEditorChange={onEditorChange}
                    />
                </div>
                <TextField
                    id="standard-select-currency"
                    select
                    fullWidth
                    // variant="outlined"
                    label="select course"
                    className="mt-3"
                    value={selectedCourse}
                    onChange={(event) => { setSelectedCourse(event.target.value) }}
                // helperText="Please select your course"
                >
                    {allCourses && allCourses.map((course) => (
                        <MenuItem key={course._id} value={course._id}>
                            {`${course.name} (${course.code})`}
                        </MenuItem>
                    ))}
                </TextField>

                <Button size="medium"
                    className="mt-4"
                    variant="contained"
                    color="primary"
                    onClick={handleSubmit}>
                    submit
                </Button>

                <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
                    <Alert onClose={handleClose} severity="success">
                        Your Announcement has been added successfully !
                    </Alert>
                </Snackbar>
            </form>
        </div >
    )
}

export default PostAnnouncement
