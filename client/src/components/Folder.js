import React, { useState, useEffect } from "react";
import axios from "axios";
import Content from './Content';
import { makeStyles } from '@material-ui/core/styles';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import IconButton from '@material-ui/core/IconButton';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import FolderIcon from '@material-ui/icons/Folder';
import CreateNewFolderIcon from '@material-ui/icons/CreateNewFolder';
import CreateNewFolderRoundedIcon from '@material-ui/icons/CreateNewFolderRounded';
import FolderRoundedIcon from '@material-ui/icons/FolderRounded';
import LibraryAddRoundedIcon from '@material-ui/icons/LibraryAddRounded';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';

import { Grid, ButtonBase, Container, Card, CardActions, CardContent, Button, Paper, Accordion, AccordionDetails, AccordionSummary, Typography } from '@material-ui/core/';

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
    // rootPaper: {
    //     display: "flex",
    //     flexWrap: "wrap",
    //     // fontSize : "15px",
    //     // width: "18em",
    //     width: "280px",
    //     height: "90px",
    //     // height: "20%",
    //     cursor: "pointer",
    //     margin: "0px 0px 30px 30px",
    //     padding: "10px 0",
    //     position: "relative",

    // },
    // rootFolderIcon: {
    //     display: "inline",
    //     // alignItems: "center",
    //     width: "2.3em",
    //     height: "3em",
    //     padding: "3px",
    //     margin: "auto 5px",
    //     // float: "left",

    //     position: "absolute",
    //     top: "50%",
    //     bottom: "50%",
    // },
    // rootFolderName: {
    //     // display: "inline",
    //     display: "flex",
    //     alignItems: "center",
    //     fontSize: "1em",
    //     // fontSize: "1.2vw",
    //     // fontWeight: "600",
    //     margin: "auto 0px",
    //     // width: "150px",
    //     // height: "50px",
    //     // textAlign: "left",

    //     position: "absolute",
    //     top: "50%",
    //     bottom: "50%",
    //     left: "25%",

    //     // float: "left",
    // },


    rootPaper: {
        height: "90px",
        cursor: "pointer",
    },
    rootFolderIcon: {
        width: "2.2em",
        height: "3em",
        // padding: "1px",
        margin: "auto 5px",
        position: "absolute",
        top: "50%",
        bottom: "50%",
    },
    rootFolderName: {
        display: "flex",
        alignItems: "center",
        position: "absolute",
        top: "50%",
        bottom: "50%",
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



const Folder = ({ folderName, rootFolder, folderClicked, role, threeDots, add, isOneClick, folderChanged }) => {
    const classes = useStyles();

    const [anchorEl, setAnchorEl] = useState(null);
    const [openDelete, setOpenDelete] = useState(false);
    const [openEdit, setOpenEdit] = useState(false);
    const [addNewFolderName, setAddNewFolderName] = useState("");
    const [openMessage, setOpenMessage] = useState(false);
    const [MessageText, setMessageText] = useState();

    let isThreeDotsClicked = false;

    let { folderID } = useParams()
    const token = localStorage.getItem('token')

    const auth = {
        headers: { token }
    }

    const handleCloseMessage = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpenMessage(false);

    };

    const editFolder = async () => {

        try {
            const res = await axios.patch(`http://localhost:8080/courses/editFolder/${rootFolder}`, { newFolderName: addNewFolderName })
            setOpenEdit(false)
            setOpenMessage(true)
            setMessageText(`folder edited successfully !`)
            setAddNewFolderName("")
            setAnchorEl(null);
            folderChanged(true);

            // setTimeout(() => {
            //     window.location.reload()
            // }, 2400)
        } catch (error) {
            console.log(error.response.data)
        }

    }

    const handleConfirmDelete = async () => {
        try {
            const res = await axios.delete(`http://localhost:8080/courses/deleteFolder/${rootFolder}`, auth)
            setOpenDelete(false);
            setOpenMessage(true);
            setMessageText("Deleted Successfully !")
            setAnchorEl(null);
            // folderChanged(true)
            setTimeout(() => window.location.reload(), 1000)

        } catch (error) {
            console.log(error)
        }
    }

    const handleClick = (e) => {
        // if (!isThreeDotsClicked) {
        if (folderName !== "Add Folder/Content") {
            folderClicked(rootFolder, isThreeDotsClicked)
        }
        else {
            add(e, isOneClick)
        }
        // }
    }

    return (
        <>
            <div className={`col-xs-12 col-sm-6 col-lg-4 col-xl-3`}>
                <Paper
                    onClick={handleClick}
                    className={`card mb-3 mx-3 ps-2 py-3 ${classes.rootPaper}`}
                >
                    <Grid container wrap="nowrap" spacing={9}>
                        <Grid item xs={2}>
                            {
                                folderName !== "Add Folder/Content" ?
                                    <FolderRoundedIcon className={classes.rootFolderIcon} />
                                    :
                                    <LibraryAddRoundedIcon className={classes.rootFolderIcon} />
                            }
                        </Grid>

                        <Grid item xs={9}>
                            <Typography variant="h6" component="span" className={`fs-6 ${classes.rootFolderName}`}>
                                {folderName}
                            </Typography>
                        </Grid>

                        <Grid item xs={1} onClick={() => isThreeDotsClicked = true}>
                            {role === "staff" && folderName !== "Add Folder/Content" && threeDots &&
                                <div className={classes.threeDots}>
                                    <Menu
                                        id="simple-menu"
                                        anchorEl={anchorEl}
                                        // keepMounted
                                        open={Boolean(anchorEl)}
                                        onClose={() => setAnchorEl(null)}

                                    >
                                        <MenuItem onClick={() => { setAnchorEl(null); setOpenEdit(true) }}>
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
                                </div>
                            }
                        </Grid>
                    </Grid>
                </Paper>
            </div>
            {/* Dialog to edit folder */}
            {
                openEdit &&
                <>
                    <Dialog open={openEdit} onClose={() => setOpenEdit(false)} aria-labelledby="form-dialog-title">
                        <DialogTitle id="form-dialog-title">Edit Folder Name</DialogTitle>
                        <DialogContent>
                            <DialogContentText>
                                To edit folder name, please enter new folder name here.
                            </DialogContentText>
                            <TextField
                                autoFocus
                                defaultValue={folderName}
                                // value={addNewFolderName}
                                onChange={(e) => setAddNewFolderName(e.target.value)}
                                margin="dense"
                                id="name"
                                label="Folder Name"
                                type="text"
                                fullWidth
                            />
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => { setOpenEdit(false); setAddNewFolderName("") }} color="primary">
                                Cancel
                            </Button>
                            <Button onClick={editFolder} color="primary">
                                Edit
                            </Button>
                        </DialogActions>
                    </Dialog>
                </>
            }

            {
                openMessage &&
                <Snackbar open={openMessage} autoHideDuration={2500} onClose={handleCloseMessage}>
                    <Alert onClose={handleCloseMessage} severity="success">
                        {MessageText}
                    </Alert>
                </Snackbar>

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
                        <DialogTitle id="alert-dialog-title">{"Delete Folder ?"}</DialogTitle>
                        <DialogContent>
                            <DialogContentText id="alert-dialog-description">
                                Are you sure you want to delete this folder ?
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

        </>


    );
}

export default Folder