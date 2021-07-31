import React, { useState, useEffect } from 'react'
import axios from "axios";
import {
    makeStyles,
    ThemeProvider,
    createMuiTheme,
} from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';
import Tooltip from '@material-ui/core/Tooltip';
import TextField from '@material-ui/core/TextField';
import { red, yellow, green, grey } from '@material-ui/core/colors';
import FavoriteIcon from '@material-ui/icons/Favorite';
import ShareIcon from '@material-ui/icons/Share';
import ThumbUpAltIcon from '@material-ui/icons/ThumbUpAlt';
import ThumbUpAltOutlinedIcon from '@material-ui/icons/ThumbUpAltOutlined';
import InsertCommentIcon from '@material-ui/icons/InsertComment';
import InsertCommentOutlinedIcon from '@material-ui/icons/InsertCommentOutlined';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import Reply from "./Reply";
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import { Redirect } from 'react-router'
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}


const useStyles = makeStyles((theme) => ({
    root: {
        // display: "inline-block",
        width: 1050,
        margin: 15,
        marginLeft: 40,
        border: "1px solid #ccc",
        borderRadius: 15

    },
    avatarStudent: {
        backgroundColor: yellow[600], //learn ho to change color
    },
    avatarInstructor: {
        backgroundColor: red[600], //learn ho to change color
    },
    textFieldComment: {
        // display: "inline-block",
        width: 924,
        margin: 15,
        marginLeft: 60,
        marginBottom: 20,
        borderRadius: 20,


    },
}));

function studentORInstructor(role , firstChar) {
    if (role === "student")
        return (
            <Tooltip title="Student" arrow>
                <Avatar aria-label="recipe" style={{ backgroundColor: yellow[600] }}>
                {firstChar}
                </Avatar>
            </Tooltip>
        )
    if (role === "staff")
        return (
            <Tooltip title="Instructor" arrow>
                <Avatar aria-label="recipe" style={{ backgroundColor: red[600] }}>
                {firstChar}
                </Avatar>
            </Tooltip>
        )
}


// function edited(edited) {
//     if (edited)
//         return "edited"
// }

const theme = createMuiTheme({
    palette: {
        primary: grey,
    },
});

const Comment = ({ commentID, postID, onDelete, commentIsDeleted }) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const [openDelete, setOpenDelete] = useState(false);
    const [openEdit, setOpenEdit] = useState(false);
    const [openMessage, setOpenMessage] = useState(false);
    const [MessageText, setMessageText] = useState();

    const handleCloseMessage = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpenMessage(false);

    };

    const handleEdit = async () => {
        try {
            const res = await axios.patch(`http://localhost:8080/discussion/${postID}/comments/${commentID}`, { newText }, auth)
            setOpenEdit(false)
            setOpenMessage(true)
            setMessageText("Edited Successfully !")
            setAnchorEl(null);
        } catch (error) {
            console.log(error.response.data)
        }

    };




    const classes = useStyles();
    const [toggleLike, setToggleLike] = useState(false);
    const [toggleReplies, setToggleReplies] = useState(false);
    const [text, setText] = useState("");
    const [commentData, setCommentData] = useState();
    const [commentReplies, setCommentReplies] = useState([]);
    const [newText, setNewText] = useState("");


    const token = localStorage.getItem('token')
    const author = localStorage.getItem('userID')
    const role = localStorage.getItem('role')


    const auth = {
        headers: { token }
    }

    const handleConfirmDelete = async () => {
        try {
            const res = await axios.delete(`http://localhost:8080/discussion/${postID}/comments/${commentID}`, auth)
            setOpenDelete(false);
            setAnchorEl(null);
            onDelete(commentID)
            setOpenMessage(true);
            setMessageText("Deleted Successfully !")
        } catch (error) {
            console.log(error.response.data)
        }

    }

    useEffect(() => {
        if (!commentIsDeleted) {
            axios.get(`http://localhost:8080/discussion/comments/${commentID}`, auth)
                .then(res => {
                    setCommentData(res.data)
                    setCommentReplies(res.data.replies)
                    setToggleLike(res.data.likes.includes(author))

                })
                .catch(err => console.log(err.response.data))
        }


    }, [commentReplies])

    const handleSubmit = async (e) => {
        e.preventDefault()
        const formData = { author, text, postID }
        try {
            const res = await axios.post(`http://localhost:8080/discussion/${commentID}/reply`, formData)
            // setDiscussionNewComments([...discussionNewComments, res.data._id])
            setCommentReplies([...commentReplies, res.data._id])
            setText("")
        } catch (error) {
            console.log(error.response.data)
        }

    }

    const hitLike = async () => {
        try {
            const res = await axios.patch(`http://localhost:8080/discussion/likeComment/${commentID}/${author}`, auth)
            setToggleLike(!toggleLike)
        } catch (error) {
            console.log(error.response.data)
        }
    }
    const hitUnLike = async () => {
        try {
            const res = await axios.patch(`http://localhost:8080/discussion/unlikeComment/${commentID}/${author}`, auth)
            setToggleLike(!toggleLike)
        } catch (error) {
            console.log(error.response.data)
        }
    }

    function likeShape(likeBool) {
        if (likeBool)
            return (
                <Button
                    onClick={hitUnLike}
                    startIcon={<ThumbUpAltIcon />}
                    size="medium" color="primary">
                    Liked ({commentData.likes.length})
                </Button>
            )
        else
            return (
                <Button
                    onClick={hitLike}
                    startIcon={<ThumbUpAltOutlinedIcon />}
                    size="medium" color="">
                    Like ({commentData.likes.length})
                </Button>
            )
    }


    function toggleSettings(role, isAuthor) {
        if (role === "staff" || isAuthor === author)
            return (
                <div>
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

    return (
        <>
            {
                commentData && <Card className={classes.root}>
                    <CardHeader
                        avatar={studentORInstructor(commentData.author.role , commentData.author.firstName.charAt(0))}
                        action={toggleSettings(role, commentData.author._id)}
                        title={`${commentData.author.firstName} ${commentData.author.lastName}`}
                        subheader={`${commentData.date} ${commentData.edited ? "(edited)" : ""}`}
                    />

                    <CardContent>
                        <Typography variant="subtitle1" component="p">
                            {commentData.text}
                        </Typography>
                    </CardContent>

                    <CardActions style={{ marginLeft: 10 }}>
                        {likeShape(toggleLike)}
                        <Button
                            onClick={() => setToggleReplies(!toggleReplies)}
                            startIcon={<InsertCommentOutlinedIcon />}
                            size="medium" color="">
                            Reply ({commentReplies.length})
                        </Button>
                    </CardActions>
                    {toggleReplies &&
                        <Container>
                            {commentReplies.map(replyID => {
                                return <Reply key={replyID} replyID={replyID} commentID={commentID} postID={postID} />
                            })}

                            <ThemeProvider theme={theme}>
                                <form onSubmit={handleSubmit} >

                                    <TextField
                                        id="outlined-textarea"
                                        // label="Comment"
                                        placeholder="Write a reply"
                                        // multiline
                                        fullWidth
                                        variant="outlined"
                                        value={text}
                                        className={classes.textFieldComment}
                                        onChange={(e) => {
                                            setText(e.target.value)
                                        }}
                                    />
                                </form>
                            </ThemeProvider>
                        </Container>
                    }
                </Card >
            }

            {
                openDelete &&
                <Container>

                    <Dialog
                        open={openDelete}
                        onClose={() => setOpenDelete(false)}
                        aria-labelledby="alert-dialog-title"
                        aria-describedby="alert-dialog-description"
                    >
                        <DialogTitle id="alert-dialog-title">{"Delete Discussion ?"}</DialogTitle>
                        <DialogContent>
                            <DialogContentText id="alert-dialog-description">
                                Are you sure you want to delete this discussion ?
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
                openEdit && commentData &&
                <>
                    <Dialog open={openEdit} onClose={() => setOpenEdit(false)} aria-labelledby="form-dialog-title">
                        <DialogTitle id="form-dialog-title">Edit Discussion</DialogTitle>
                        <DialogContent>
                            <DialogContentText>
                                To edit discussion, please enter new text here.
                            </DialogContentText>
                            <TextField
                                autoFocus
                                defaultValue={commentData.text}
                                // value={newText}
                                onChange={(e) => setNewText(e.target.value)}
                                margin="dense"
                                id="name"
                                label="New Text"
                                type="text"
                                fullWidth
                            />
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

export default Comment
