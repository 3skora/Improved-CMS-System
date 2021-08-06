import React, { useState, useEffect } from 'react'
import axios from "axios";
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import OndemandVideoRoundedIcon from '@material-ui/icons/OndemandVideoRounded';
import GetAppRoundedIcon from '@material-ui/icons/GetAppRounded';
import ForumRoundedIcon from '@material-ui/icons/ForumRounded';
import Container from '@material-ui/core/Container';

import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import IconButton from '@material-ui/core/IconButton';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import {
    BrowserRouter as Router,
    Switch,
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
    buttonVideo: {
        margin: theme.spacing(1),
        '&:hover': {
            color: "white",
            backgroundColor: "darked"
        }
    },

    buttonDiscussion: {
        margin: theme.spacing(1),
        '&:hover': {
            color: "white",
            // backgroundColor: "crimson"
        }
    },

    content: {
        margin: 2
    },

    threeDots: {
        display: "flex",
        alignItems: "center",
        // margin: "auto",
        padding: "8px",
        position: "absolute",
        top: 0,
        // bottom: "10%",
        right: 0,
    }
}));

const ContentCard = ({ contentID, token, searchText, folderChanged }) => {
    const classes = useStyles();
    const [content, setContent] = useState();

    const [anchorEl, setAnchorEl] = useState(null);
    const [openDelete, setOpenDelete] = useState(false);
    const [openEdit, setOpenEdit] = useState(false);
    const [openMessage, setOpenMessage] = useState(false);
    const [MessageText, setMessageText] = useState();

    const author = localStorage.getItem('userID')
    const role = localStorage.getItem('role')

    let { folderID } = useParams()

    const auth = {
        headers: { token }
    }

    useEffect(() => {
        axios.get(`http://localhost:8080/contents/${contentID}`, auth)
            .then(res => {
                setContent(res.data)
            })
            .catch(err => console.log(err))

    }, [])

    const videoBtn = (type) => {
        if (type.includes("video"))
            return (
                <Button
                    variant="contained"
                    color="secondary"
                    className={classes.buttonVideo}
                    startIcon={<OndemandVideoRoundedIcon />}
                    href={`/dashboard/${folderID}/watch/${contentID}`}
                >
                    Watch Video
                </Button>
            )
        else
            return (
                <Button
                    variant="contained"
                    color="secondary"
                    className={classes.buttonVideo}
                    href={`http://localhost:8080/contents/${contentID}/download`}
                    startIcon={<GetAppRoundedIcon />}
                >
                    Download
                </Button>
            )
    }

    function highlightText(text) {
        if (text && searchText) {
            const regex = new RegExp(searchText, "gi")
            let newText = text.replace(regex, `<mark>$&</mark>`)
            return <span dangerouslySetInnerHTML={{ __html: newText }} />;
        }
        else
            return <span>{text}</span>
    }

    function tagText(text) {
        if (text) {
            const regex = new RegExp(/#[^,]+/, "gi")
            let newText = text.replace(regex, `<span class="tag">$&</span class="tag">`)
            return <span dangerouslySetInnerHTML={{ __html: newText }} />;
        }
        else
            return <span>{text}</span>
    }

    function toggleSettings(role) {
        if (role === "staff")
            return (
                <div className={classes.threeDots}>
                    <Menu
                        id="simple-menu"
                        anchorEl={anchorEl}
                        // keepMounted
                        open={Boolean(anchorEl)}
                        onClose={() => setAnchorEl(null)}

                    >
                        <MenuItem onClick={() => setOpenEdit(true)}>
                            <EditIcon style={{ marginRight: 7 }} />
                            Edit
                        </MenuItem>

                        <MenuItem onClick={() => setOpenDelete(true)}>
                            <DeleteIcon style={{ marginRight: 7 }} />
                            Delete
                        </MenuItem>
                    </Menu>
                    <IconButton aria-label="settings" onClick={(e) => setAnchorEl(e.currentTarget)}>
                        <MoreVertIcon />
                    </IconButton>
                </div >
            )
    }

    const handleCloseMessage = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenMessage(false);
    };

    // const handleEdit = async () => {
    //     try {
    //         const newAnnouncement = newText
    //         const formData = { newAnnouncement, courseID, index, author }
    //         const res = await axios.patch(`http://localhost:8080/courses/courseAnnouncements/`, formData, auth)
    //         setOpenEdit(false)
    //         setOpenMessage(true)
    //         setMessageText("Edited Successfully !")
    //         setAnchorEl(null);
    //     } catch (error) {
    //         console.log(error.response.data)
    //     }

    // };

    const handleConfirmDelete = async () => {
        try {
            const res = await axios.delete(`http://localhost:8080/contents/${folderID}/${contentID}`, auth)
            setOpenDelete(false);
            setOpenMessage(true);
            setMessageText("Deleted Successfully !")
            setAnchorEl(null);
            // folderChanged(true)
            window.location.reload()

        } catch (error) {
            console.log(error)
        }
    }

    return (

        <>
            {content &&
                <div className={`col-sm-12 col-lg-6 col-xl-4`}>

                    <Card className={`card mb-3`}
                    >
                        <CardContent>
                            <div>
                                <h3 className="card-title text-center">{highlightText(content.title)}</h3>
                                {toggleSettings(role)}
                            </div>
                            <p className="card-text"><b>Uploaded At: </b>{content.date}</p>
                            <p className="card-text"><b>Uploaded By: </b>{content.author.firstName} {content.author.lastName}</p>
                            <p className="card-text"><b>Tags: </b>{searchText ? highlightText(content.tag) : tagText(content.tag)}</p>

                        </CardContent>
                        <CardActions style={{ justifyContent: "center" }}>
                            {videoBtn(content.file.mimetype)}
                            <Button
                                variant="contained"
                                color="primary"
                                className={classes.buttonDiscussion}
                                startIcon={<ForumRoundedIcon />}
                                href={`/discussion/content/${contentID}`}
                            >
                                Discussion
                            </Button>
                        </CardActions>
                    </Card>
                </div>
            }

            {
                openDelete &&
                <>
                    <Dialog
                        open={openDelete}
                        onClose={() => setOpenDelete(false)}
                        aria-labelledby="alert-dialog-title"
                        aria-describedby="alert-dialog-description"
                    >
                        <DialogTitle id="alert-dialog-title">{"Delete Content ?"}</DialogTitle>
                        <DialogContent>
                            <DialogContentText id="alert-dialog-description">
                                Are you sure you want to delete this content ?
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => setOpenDelete(false)} color="primary">
                                Cancel
                            </Button>
                            <Button onClick={handleConfirmDelete} style={{ marginRight: 8 }} color="primary" autoFocus>
                                Delete
                            </Button>
                        </DialogActions>
                    </Dialog>
                </>
            }
            {
                openMessage &&
                <Snackbar open={openMessage} autoHideDuration={2000} onClose={handleCloseMessage}>
                    <Alert onClose={handleCloseMessage} severity="success">
                        {MessageText}
                    </Alert>
                </Snackbar>

            }
        </>

    )
}

export default ContentCard
