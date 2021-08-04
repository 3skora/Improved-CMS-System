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


import {
    makeStyles,
    ThemeProvider,
    createMuiTheme,
} from '@material-ui/core/styles';




const useStyles = makeStyles((theme) => ({
    root: {
        // display: "inline-block",
        // width: 1200,
        margin: "0px 1.5% 1.8%",
        // borderLeft: "8px solid crimson",
        borderRadius: 5,
        position: "relative",
        padding: 0

    },
    threeDots: {
        display: "flex",
        // alignItems: "center",
        margin: "auto",
        position: "absolute",
        top: "10%",
        // bottom: "10%",
        right: "0%",
    }
}))

const Announcement = ({ text }) => {
    const classes = useStyles();
    const [anchorEl, setAnchorEl] = useState(null);
    const [openDelete, setOpenDelete] = useState(false);
    const [openEdit, setOpenEdit] = useState(false);
    const [addNewFolderName, setAddNewFolderName] = useState("");
    const [openMessage, setOpenMessage] = useState(false);
    const [MessageText, setMessageText] = useState();


    const handleCloseMessage = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpenMessage(false);

    };
    const role = localStorage.getItem('role')


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

    return (
        <div className="row">
            <Card
                className={classes.root}
            >
                {/* <CardHeader

                // avatar={studentORInstructor(discussionData.author.role)}
                // action={toggleSettings(role)}
                // title={`${discussionData.author.firstName} ${discussionData.author.lastName}`}
                // subheader={`${discussionData.date} ${discussionData.edited ? "(edited)" : ""}`}
                /> */}

                <CardContent>
                    <Typography variant="subtitle1" component="p">
                        <div dangerouslySetInnerHTML={{ __html: text }} />
                    </Typography>
                    {/* <MoreVertIcon className={classes.threeDots} /> */}
                </CardContent>
                {toggleSettings(role)}
            </Card>

        </div>
    )
}

export default Announcement
