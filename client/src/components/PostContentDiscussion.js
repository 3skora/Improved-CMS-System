import React, { useState, useEffect } from 'react'
import axios from "axios";
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import {
    BrowserRouter as Router,
    Route,
    Link,
    useHistory,
    useLocation,
    useParams,
} from "react-router-dom";

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
        // minWidth: 120,
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

const PostContentDiscussion = () => {

    const classes = useStyles();
    const [open, setOpen] = useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpen(false);
    };


    const [text, setText] = useState("");

    const token = localStorage.getItem('token')
    const author = localStorage.getItem('userID')
    let { contentID } = useParams()


    const auth = {
        headers: { token }
    }


    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = { text, author, type: "content", ID: contentID };
        console.log("🚀 ~ file: PostDiscussion.js ~ line 94 ~ handleSubmit ~ formData", formData)
        try {
            await axios.post("http://localhost:8080/discussion/", formData, auth)
            setText("")
            setOpen(true)
        } catch (error) {
            console.log(error.response.data)
        }
    };
    return (
        <div className="container-fluid" style={{ margin: "auto 20%", alignItems: 'center' , justifyContent:"center" }}>
            <form onSubmit={handleSubmit}>
                <TextField
                    align="center"
                    id="standard-textarea"
                    placeholder="Write a Post .."
                    multiline
                    fullWidth
                    value={text}
                    className="mt-2"
                    onChange={(event) => setText(event.target.value)}
                />


                <Button size="medium"
                    className="mt-5"
                    variant="contained"
                    color="primary"
                    onClick={handleSubmit}>
                    submit
                </Button>

                <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
                    <Alert onClose={handleClose} severity="success">
                        Your Post has been added successfully !
                    </Alert>
                </Snackbar>
            </form>
        </div >
    )
}

export default PostContentDiscussion
