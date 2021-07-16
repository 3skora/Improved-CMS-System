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

import { ButtonBase, Container, Card, CardActions, CardContent, Button, Paper, Accordion, AccordionDetails, AccordionSummary, Typography } from '@material-ui/core/';

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStyles = makeStyles((theme) => ({
    // rootPaper: {
    //     display: "flex",
    //     flexWrap: "wrap",

    //     width: "250px",
    //     height: "20%",
    //     cursor: "pointer",
    //     margin: "20px 0",
    //     padding: "10px 0",
    //     position: "relative",

    // },
    // rootFolderIcon: {
    //     // display: "flex",
    //     // alignItems: "center",
    //     width: "2.3em",
    //     height: "3em",
    //     padding: "3px",
    //     margin: "auto 5px",
    //     // float: "left",
    // },
    // rootFolderName: {
    //     // display: "inline",
    //     display: "flex",
    //     alignItems: "center",

    //     fontSize: "1em",
    //     // fontSize: "1.2vw",
    //     // fontWeight: "600",
    //     margin: "auto 5px",
    //     width: "150px",
    //     height: "50px",
    //     // textAlign: "left",

    //     position: "absolute",
    //     top: "20%",
    //     left: "25%",

    //     // float: "left",
    // },

    rootPaper: {
        display: "flex",
        flexWrap: "wrap",
        // fontSize : "15px",
        // width: "18em",
        width: "280px",
        height: "90px",
        // height: "20%",
        cursor: "pointer",
        margin: "0px 0px 30px 30px",
        padding: "10px 0",
        position: "relative",

    },
    rootFolderIcon: {
        display: "inline",
        // alignItems: "center",
        width: "2.3em",
        height: "3em",
        padding: "3px",
        margin: "auto 5px",
        // float: "left",

        position: "absolute",
        top: "50%",
        bottom: "50%",
    },
    rootFolderName: {
        // display: "inline",
        display: "flex",
        alignItems: "center",
        fontSize: "1em",
        // fontSize: "1.2vw",
        // fontWeight: "600",
        margin: "auto 0px",
        // width: "150px",
        // height: "50px",
        // textAlign: "left",

        position: "absolute",
        top: "50%",
        bottom: "50%",
        left: "25%",

        // float: "left",
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

    const handleCloseMessage = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpenMessage(false);

    };

    const editFolder = async () => {
        console.log(addNewFolderName)
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


    return (
        <>
            <Paper
                onClick={(e) => add(e, isOneClick)}
                onDoubleClick={() => folderClicked(rootFolder)}
                className={classes.rootPaper}>
                {
                    folderName !== "Add Folder/Content" ?
                        <FolderRoundedIcon className={classes.rootFolderIcon} />
                        :
                        <LibraryAddRoundedIcon className={classes.rootFolderIcon} />
                }
                <Typography variant="h6" className={classes.rootFolderName}>
                    {folderName}
                </Typography>


                {role === "staff" && folderName !== "Add Folder/Content" && threeDots &&
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
                }

            </Paper>

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
                                label="New Text"
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

        </>


    );
}

export default Folder