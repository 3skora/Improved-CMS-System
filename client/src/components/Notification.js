import React, { useState, useEffect } from "react";
import axios from "axios";
import Discussion from './Discussion'
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
import {
    makeStyles,
    ThemeProvider,
    createMuiTheme,
} from '@material-ui/core/styles';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import { red, yellow, green, grey } from '@material-ui/core/colors';
import FavoriteIcon from '@material-ui/icons/Favorite';
import ShareIcon from '@material-ui/icons/Share';
import ThumbUpAltIcon from '@material-ui/icons/ThumbUpAlt';
import ThumbUpAltOutlinedIcon from '@material-ui/icons/ThumbUpAltOutlined';
import InsertCommentIcon from '@material-ui/icons/InsertComment';
import InsertCommentOutlinedIcon from '@material-ui/icons/InsertCommentOutlined';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import TextField from '@material-ui/core/TextField';
import Reply from "./Reply";
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Comment from "./Comment";
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import PropTypes from 'prop-types';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import AppBar from '@material-ui/core/AppBar';
import Divider from '@material-ui/core/Divider';
import Box from '@material-ui/core/Box';
import PostContentDiscussion from "./PostContentDiscussion";
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import { Redirect } from 'react-router'
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
    root: {
        // display: "inline-block",
        width: 1200,
        margin: "0px 15px 30px",
        // borderLeft: "8px solid #ccc",
        borderRadius: 5,
        cursor: "pointer",
        position: "relative",

    },
    avatarStudent: {
        backgroundColor: yellow[600], //learn ho to change color
    },
    avatarInstructor: {
        backgroundColor: red[600], //learn ho to change color
    },
    threeDots: {
        display: "flex",
        alignItems: "center",
        margin: "auto",
        position: "absolute",
        top: "50%",
        bottom: "50%",
        right: "0%",
    }
}));

function studentORInstructor(role) {
    if (role === "student")
        return (
            <Tooltip title="Student" arrow>
                <Avatar aria-label="recipe" style={{ backgroundColor: yellow[600] }}>
                    S
                </Avatar>
            </Tooltip>
        )
    if (role === "staff")
        return (
            <Tooltip title="Instructor" arrow>
                <Avatar aria-label="recipe" style={{ backgroundColor: red[600] }}>
                    I
                </Avatar>
            </Tooltip>
        )
}


const theme = createMuiTheme({
    palette: {
        primary: grey,
    },
});



const Notification = ({ notificationID }) => {
    const classes = useStyles();
    const [notificationData, setNotificationData] = useState();

    const [anchorEl, setAnchorEl] = useState(null);
    const [openDelete, setOpenDelete] = useState(false);
    const [openEdit, setOpenEdit] = useState(false);
    const [openMessage, setOpenMessage] = useState(false);
    const [MessageText, setMessageText] = useState();


    const token = localStorage.getItem('token')
    const userID = localStorage.getItem('userID')

    let history = useHistory()

    const auth = {
        headers: { token }
    }

    useEffect(() => {

        axios.get(`http://localhost:8080/notifications/${notificationID}`, auth)
            .then(res => {
                setNotificationData(res.data)
            })
            .catch(err => console.log(err.response.data))

    }, [notificationData])

    const handleClick = () => {
        if (notificationData.type === "discussion") {
            history.push(`discussion/${notificationData.refID}`)
            window.location.reload()
        }
        // <Redirect to={`discussion/${notificationData.refID}`} />
        // history.go()
    }

    const handleConfirmDelete = async () => {
        try {
            const res = await axios.delete(`http://localhost:8080/notification/${notificationID}`, auth)
            console.log(res.data)
            setOpenDelete(false);
            setOpenMessage(true);
            setMessageText("Deleted Successfully !")
            setAnchorEl(null);

        } catch (error) {
            console.log(error)
        }
    }

    function toggleSettings() {
        return (
            <span>
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
            </span>
        )
    }

    return (
        <div>

            {
                notificationData &&
                <Card
                    className={classes.root}
                    onClick={handleClick}
                >
                    {/* <CardHeader

                        avatar={studentORInstructor(notificationData.role)}
                        action={toggleSettings()}
                        // title={`${discussionData.author.firstName} ${discussionData.author.lastName}`}
                        subheader={`${notificationData.date}`}
                    /> */}

                    <CardContent>
                        <Typography variant="h6" component="p">
                            {notificationData.text}
                        </Typography>

                        <Typography variant="body1" component="p" color="textSecondary">
                            {notificationData.date}
                        </Typography>
                        {/* {toggleSettings()} */}
                    </CardContent>
                </Card>
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
        </div>
    )
}

export default Notification
