import React, { useState, useEffect } from "react";
import axios from "axios";
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import Paper from '@material-ui/core/Paper';
import Container from '@material-ui/core/Container';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
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
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import TextEditor from './TextEditor'

import {
    makeStyles,
    ThemeProvider,
    createMuiTheme,
} from '@material-ui/core/styles';


function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}


const useStyles = makeStyles((theme) => ({
    root: {
        // display: "inline-block",
        // width: 1200,
        maxWidth: "98.5%",
        margin: "0px 1.5% 1.8%",
        // borderLeft: "8px solid crimson",
        borderRadius: 5,
        position: "relative",
        padding: 0

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
}))

const Announcement = ({ text, index, courseID }) => {
    const classes = useStyles();
    const [anchorEl, setAnchorEl] = useState(null);
    const [openDelete, setOpenDelete] = useState(false);
    const [openEdit, setOpenEdit] = useState(false);
    const [newText, setNewText] = useState(text);
    const [openMessage, setOpenMessage] = useState(false);
    const [MessageText, setMessageText] = useState();

    const token = localStorage.getItem('token')
    const author = localStorage.getItem('userID')
    const role = localStorage.getItem('role')

    const auth = {
        headers: { token }
    }

    const handleCloseMessage = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenMessage(false);
    };

    const handleEdit = async () => {
        try {
            const newAnnouncement = newText
            const formData = { newAnnouncement, courseID, index, author }
            const res = await axios.patch(`http://localhost:8080/courses/courseAnnouncements/`, formData, auth)
            setOpenEdit(false)
            setOpenMessage(true)
            setMessageText("Edited Successfully !")
            setAnchorEl(null);
        } catch (error) {
            console.log(error.response.data)
        }

    };

    const handleConfirmDelete = async () => {
        try {
            const res = await axios.delete(`http://localhost:8080/courses/courseAnnouncements/delete/${courseID}/${index}`, auth)
            setOpenDelete(false);
            setOpenMessage(true);
            setMessageText("Deleted Successfully !")
            setAnchorEl(null);

        } catch (error) {
            console.log(error)
        }
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

    const onEditorChange = (value) => {
        setNewText(value)
    }

    return (
        <>
            <div className="row">
                <Card className={classes.root}>
                    <CardContent>
                        <Typography variant="subtitle1" component="p">
                            <div dangerouslySetInnerHTML={{ __html: text }} />
                        </Typography>
                    </CardContent>
                    {toggleSettings(role)}
                </Card>
            </div>

            {
                openDelete &&
                <Container>
                    <Dialog
                        open={openDelete}
                        onClose={() => setOpenDelete(false)}
                        aria-labelledby="alert-dialog-title"
                        aria-describedby="alert-dialog-description"
                    >
                        <DialogTitle id="alert-dialog-title">{"Delete Announcement ?"}</DialogTitle>
                        <DialogContent>
                            <DialogContentText id="alert-dialog-description">
                                Are you sure you want to delete this announcement ?
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
                </Container>
            }
            {
                openMessage &&
                <Snackbar open={openMessage} autoHideDuration={2000} onClose={handleCloseMessage}>
                    <Alert onClose={handleCloseMessage} severity="success">
                        {MessageText}
                    </Alert>
                </Snackbar>

            }

            {/* {openMessage && openDelete &&
                setTimeout(() => {
                    window.location.reload()
                }, 2500)
            } */}

            {
                openEdit &&
                <>
                    <Dialog open={openEdit} onClose={() => setOpenEdit(false)} aria-labelledby="form-dialog-title">
                        <DialogTitle id="form-dialog-title">Edit Announcement</DialogTitle>
                        <DialogContent>
                            <DialogContentText>
                                To edit announcement, please enter new text here.
                            </DialogContentText>
                            <div class="app">
                                <TextEditor
                                    align="center"
                                    value={newText}
                                    onEditorChange={onEditorChange}
                                />
                            </div>
                            {/* <TextField
                                autoFocus
                                defaultValue={text}
                                // value={newText}
                                onChange={(e) => setNewText(e.target.value)}
                                margin="dense"
                                id="name"
                                label="New Text"
                                type="text"
                                fullWidth
                            /> */}
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => setOpenEdit(false)} color="primary">
                                Cancel
                            </Button>
                            <Button onClick={handleEdit} color="primary">
                                Edit
                            </Button>
                        </DialogActions>
                    </Dialog>
                </>
            }
        </>
    )
}

export default Announcement
