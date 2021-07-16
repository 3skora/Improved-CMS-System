import React, { useState, useEffect } from 'react'
import axios from "axios";
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    useHistory,
    useLocation,
    useParams,
} from "react-router-dom";
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';


function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export default function FormDialog({ isOpen, isClosed, folderChanged, courseID }) {
    const [open, setOpen] = React.useState(isOpen);
    const [openMessage, setOpenMessage] = useState(false);
    const [MessageText, setMessageText] = useState();


    const handleClose = () => {
        setOpen(false);
    };

    const handleCloseMessage = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpenMessage(false);

    };

    const [tag, setTag] = useState("");
    const [title, setTitle] = useState("");
    const [file, setFile] = useState();


    const token = localStorage.getItem('token')
    const userID = localStorage.getItem('userID')
    const role = localStorage.getItem('role')
    let rootFolder = useParams().folderID
    const auth = {
        headers: { token }
    }


    const handelSubmit = async (e) => {
        console.log("submitted")
        e.preventDefault();
        e.stopPropagation();
        try {
            const formData = new FormData();
            formData.append("tag", tag)
            formData.append("title", title)
            formData.append("file", file)
            formData.append("courseID", courseID)
            const res = await axios.post(`http://localhost:8080/contents/upload/${rootFolder}`, formData, auth)
            console.log(res.data)

            setOpen(false)
            setOpenMessage(true)
            setMessageText(`content uploaded successfully !`)
            folderChanged(true);
        } catch (error) {
            console.log(error.response.data)
        }

    };

    return (
        <div>
            <Dialog open={isOpen} onClose={() => isClosed()} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Upload Content</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        To upload content, please enter content data here.
                    </DialogContentText>
                    <div className="container">
                        <form onSubmit={handelSubmit} encType="multipart/form-data">

                            <div className="my-2">
                                <label className="form-label" htmlFor="title">
                                    Title
                                </label>
                                <input
                                    className="form-control"
                                    type="text"
                                    id="title"
                                    value={title}
                                    onChange={(event) => setTitle(event.target.value)}
                                ></input>
                            </div>

                            <div className="my-2">
                                <label className="form-label" htmlFor="tag">
                                    Tags
                                </label>
                                <input
                                    className="form-control"
                                    type="text"
                                    placeholder="Please separate tags between ','"
                                    id="tag"
                                    value={tag}
                                    onChange={(event) => setTag(event.target.value)}
                                ></input>
                            </div>

                            <div className="my-2">
                                <label className="form-label" htmlFor="file">
                                    File
                                </label>
                                <input
                                    className="form-control"
                                    type="file"
                                    id="file"
                                    name="file"
                                    onChange={(event) => setFile(event.target.files[0])}
                                ></input>
                            </div>
                        </form>
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button className="m-2" onClick={() => isClosed()} variant="contained" color="primary">
                        Cancel
                    </Button>
                    <Button className="m-2" onClick={handelSubmit} variant="contained" color="primary">
                        Upload
                    </Button>
                </DialogActions>
            </Dialog>

            {
                openMessage &&
                <Snackbar open={openMessage} autoHideDuration={2500} onClose={handleCloseMessage}>
                    <Alert onClose={handleCloseMessage} severity="success">
                        {MessageText}
                    </Alert>
                </Snackbar>

            }
        </div>
    );
}
