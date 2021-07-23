import React, { useState, useEffect } from "react";
import axios from "axios";
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import Paper from '@material-ui/core/Paper';
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

import Comment from "./Comment";
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

const useStyles = makeStyles((theme) => ({
    root: {
        // display: "inline-block",
        width: 1200,
        margin: "0px 15px 30px",
        // borderLeft: "8px solid #ccc",
        borderRadius: 5
    },
}))

const Announcement = ({ text }) => {
    const classes = useStyles();

    return (
        <div>
            <Card
                className={classes.root}
            >
                {/* <CardHeader

                avatar={studentORInstructor(discussionData.author.role)}
                action={toggleSettings(role, discussionData.author._id)}
                title={`${discussionData.author.firstName} ${discussionData.author.lastName}`}
                subheader={`${discussionData.date} ${discussionData.edited ? "(edited)" : ""}`}
                /> */}

                <CardContent>
                    <Typography variant="subtitle1" component="p">
                        <div dangerouslySetInnerHTML={{ __html: text }} />
                    </Typography>
                </CardContent>
            </Card>

        </div>
    )
}

export default Announcement
