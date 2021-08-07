import React, { useState, useEffect } from "react";
import axios from "axios";
import Folder from './Folder'
import Content from './Content';
import FolderIcon from '@material-ui/icons/Folder';

import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { makeStyles } from '@material-ui/core/styles';
import { Grid, Card, CardActions, CardContent, Button, Paper, Accordion, AccordionDetails, AccordionSummary, Typography } from '@material-ui/core/';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    useHistory,
    useLocation,
    useParams,
} from "react-router-dom";
import { Redirect } from 'react-router'
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import UploadContent from "../components/staff/UploadContent"
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import NavFolder from "./NavFolder"


function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStyles = makeStyles((theme) => ({
    rootAccordion: {
        width: '100%',
        // marginBottom : "15px"
    },
    heading: {
        fontSize: theme.typography.pxToRem(15),
        flexBasis: '33.33%',
        flexShrink: 0,
    },
    secondaryHeading: {
        fontSize: theme.typography.pxToRem(15),
        color: theme.palette.text.secondary,
    },



    // rootPaper: {
    //     display: "flex",
    //     flexWrap: "wrap",
    //     width: "250px",
    //     height: "20%",
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

    root: {
        flexGrow: 1,
    },

}));

const Dashboard = () => {
    const classes = useStyles();
    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleClose = () => {
        setAnchorEl(null);
        setAddNewFolderName("")

    };

    const handleClick = (event, isOneClick) => {
        if (isOneClick)
            setAnchorEl(event.currentTarget);
    };


    const handleCloseMessage = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpenMessage(false);

    };

    const [subFolders, setSubFolders] = useState();
    const [contents, setContents] = useState();
    const [loadingSubFolders, setLoadingSubFolders] = useState(true);
    const [threeDots, setThreeDots] = useState(false);
    const [foldersChanged, setFoldersChanged] = useState(true);
    const [isExpand, setIsExpand] = useState(false);
    const [navs, setNavs] = useState([{ _id: "", folderName: "Dashboard" }]);
    const [courseID, setCourseID] = useState()

    const [openAdd, setOpenAdd] = useState(false);
    const [addNewFolderName, setAddNewFolderName] = useState("");
    const [openMessage, setOpenMessage] = useState(false);
    const [MessageText, setMessageText] = useState();

    const [openUpload, setOpenUpload] = useState(false);


    let history = useHistory()
    let rootFolder = useParams().folderID

    const token = localStorage.getItem('token')
    const userID = localStorage.getItem('userID')
    const role = localStorage.getItem('role')

    const auth = {
        headers: { token }
    }


    useEffect(() => {
        if (!rootFolder) {

            axios.get(`http://localhost:8080/courses/${userID}`, auth)
                .then(res => {
                    setSubFolders(res.data)
                    setLoadingSubFolders(true)
                    setThreeDots(false)
                })
                .catch(err => console.log(err))
        }
        else {
            axios.get(`http://localhost:8080/courses/folder/${rootFolder}`, auth)
                .then(res => {
                    setSubFolders(res.data.subFolders)
                    setLoadingSubFolders(false)
                    setThreeDots(true)
                    setNavsPro(res.data.folderName)
                    setContents(res.data.contents.reverse())
                    setFoldersChanged(false)
                })
                .catch(err => console.log(err))
        }

    }, [rootFolder, foldersChanged])

    const handleDoubleClickFn = (rootFolderParam, isThreeDotsClicked) => {
        if (!isThreeDotsClicked)
            history.push(`${rootFolderParam}`)
    }

    const setNavsPro = async (folderName) => {
        const dashboard = { _id: "", folderName: "Dashboard" }
        const last = { _id: rootFolder, folderName: folderName }
        let navArr = []
        let changingRootFolder = rootFolder;
        try {
            while (changingRootFolder != null) {
                let res = await axios.get(`http://localhost:8080/courses/rootFolder/${changingRootFolder}`, auth)
                if (!res.data)
                    break
                navArr.push(res.data)
                changingRootFolder = res.data._id
            }
            navArr.push(dashboard)
            const result = navArr.reverse()
            result.push(last)
            // console.log("navs from setNavs pro =>>>> ", result)
            setNavs(result)

            if (result[1] && result[1].folderName) {
                const start = result[1].folderName.lastIndexOf("(") + 1
                const end = result[1].folderName.lastIndexOf(")")
                const code = result[1].folderName.substring(start, end)
                let codeResult = await axios.get(`http://localhost:8080/courses/code/${code}`)
                setCourseID(codeResult.data._id)
            }
        } catch (error) {
            console.log(error)
        }

    }

    const addFolder = async () => {
        console.log(addNewFolderName)
        try {
            const res = await axios.post(`http://localhost:8080/courses/createFolder/${rootFolder}`, { folderName: addNewFolderName })
            setOpenAdd(false)
            setOpenMessage(true)
            setMessageText(`${addNewFolderName} folder added successfully !`)
            setAddNewFolderName("")
            setAnchorEl(null);
            setFoldersChanged(true);

            // setTimeout(() => {
            //     window.location.reload()
            // }, 2400)
        } catch (error) {
            console.log(error.response.data)
        }

    }

    const setFoldersChangedFN = (bool) => {
        setFoldersChanged(bool)
    }
    const closeDialogContent = () => {
        setOpenUpload(false)
    }

    return (
        <div>
            {subFolders &&
                <div className={classes.rootAccordion}>
                    {navs.length !== 0 && <NavFolder
                        isExpand={isExpand}
                        navs={navs}
                    // setNewNavs={setNavsPro}
                    />}
                    <Accordion defaultExpanded={true}>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <Typography className={classes.heading}>Folders ({subFolders.length})</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <div className={classes.root}>
                                <div className="container-fluid">
                                    <div className="row gx-4">
                                        {
                                            subFolders.map(item => {
                                                return (
                                                    <Folder
                                                        add={handleClick}
                                                        folderClicked={handleDoubleClickFn}
                                                        isOneClick={false}
                                                        // threeDotsClicked={isThreeDotsClicked}
                                                        // setThreeDotsClicked={setThreeDotsClicked}
                                                        rootFolder={item._id}
                                                        folderName={item.folderName}
                                                        role={role}
                                                        threeDots={threeDots}
                                                        folderChanged={setFoldersChangedFN}
                                                        key={item._id}
                                                    />
                                                )
                                            })
                                        }

                                        {
                                            !loadingSubFolders && role === "staff" &&
                                            <>
                                                <Folder
                                                    add={handleClick}
                                                    // folderClicked={handleAddSubFolderOrContentFn}
                                                    isOneClick={true}
                                                    // threeDotsClicked={isThreeDotsClicked}
                                                    rootFolder={rootFolder}
                                                    folderName="Add Folder/Content"
                                                    role={role}
                                                />

                                                <Menu
                                                    id="simple-menu"
                                                    anchorEl={anchorEl}
                                                    keepMounted
                                                    open={Boolean(anchorEl)}
                                                    onClose={handleClose}
                                                >
                                                    <MenuItem onClick={() => setOpenAdd(true)}>Add Folder</MenuItem>
                                                    <MenuItem onClick={() => setOpenUpload(true)}>Upload Content</MenuItem>
                                                </Menu>

                                                {/* Dialog to add new folder */}
                                                {
                                                    openAdd &&
                                                    <>
                                                        <Dialog open={openAdd} onClose={() => setOpenAdd(false)} aria-labelledby="form-dialog-title">
                                                            <DialogTitle id="form-dialog-title">Add New Folder</DialogTitle>
                                                            <DialogContent>
                                                                <DialogContentText>
                                                                    To add a new folder, please enter folder name here.
                                                                </DialogContentText>
                                                                <TextField
                                                                    autoFocus
                                                                    // defaultValue={discussionData.text}
                                                                    value={addNewFolderName}
                                                                    onChange={(e) => setAddNewFolderName(e.target.value)}
                                                                    margin="dense"
                                                                    id="name"
                                                                    label="New Text"
                                                                    type="text"
                                                                    fullWidth
                                                                />
                                                            </DialogContent>
                                                            <DialogActions>
                                                                <Button onClick={() => { setOpenAdd(false); setAddNewFolderName("") }} color="primary">
                                                                    Cancel
                                                                </Button>
                                                                <Button onClick={addFolder} color="primary">
                                                                    Add
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
                                                    openUpload ? <UploadContent isOpen={true} isClosed={closeDialogContent} folderChanged={setFoldersChangedFN} courseID={courseID} />
                                                        :
                                                        <UploadContent isOpen={false} isClosed={closeDialogContent} folderChanged={setFoldersChangedFN} courseID={courseID} />
                                                }
                                            </>
                                        }

                                    </div>
                                </div>
                            </div>
                        </AccordionDetails>
                    </Accordion>
                </div>
            }

            {
                contents &&
                <div className={classes.rootAccordion}>
                    <Accordion defaultExpanded={true}>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <Typography className={classes.heading}>Contents ({contents.length})</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <div className="container">
                                <div className="row gx-4">
                                    {
                                        contents.map(content => {
                                            return <Content
                                                key={content}
                                                contentID={content}
                                                token={token}
                                                folderChanged={setFoldersChangedFN}
                                            />
                                        })
                                    }
                                </div>
                            </div>

                        </AccordionDetails>
                    </Accordion>
                </div>
            }
        </div >
    )
}

export default Dashboard