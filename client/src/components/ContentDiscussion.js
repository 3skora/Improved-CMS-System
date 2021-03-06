import React, { useState, useEffect } from "react";
import axios from "axios";
import Discussion from './Discussion'
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import AppBar from '@material-ui/core/AppBar';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';
import PostContentDiscussion from "./PostContentDiscussion";
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    useHistory,
    useLocation,
    useParams,
} from "react-router-dom";


function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`vertical-tabpanel-${index}`}
            aria-labelledby={`vertical-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box p={3}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired,
};

function a11yProps(index) {
    return {
        id: `vertical-tab-${index}`,
        'aria-controls': `vertical-tabpanel-${index}`,
    };
}

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.paper,
        display: 'flex',
        // height: 224,
        direction: "row-reverse",
        justify: "flex-start",
        paddingLeft: 0,


    },
    tabs: {
        // paddingLeft: 0,
        borderRight: `1px solid ${theme.palette.divider}`,
    },
    myDivider: {
        margin: "10px 0px",
        border: `1px solid ${theme.palette.divider}`
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


const ContentDiscussion = () => {
    const classes = useStyles();
    const [value, setValue] = useState(0);
    const [contentDiscussionArr, setContentDiscussionArr] = useState();


    const token = localStorage.getItem('token')
    const userID = localStorage.getItem('userID')
    let { contentID } = useParams()


    const auth = {
        headers: { token }
    }

    useEffect(() => {

        axios.get(`http://localhost:8080/discussion/content/${contentID}`, auth)
            .then(res => {
                setContentDiscussionArr(res.data)
            })
            .catch(err => console.log(err.response.data))

    }, [contentDiscussionArr])

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };



    return (
        <div className="container-fluid">
            <div className="row">
                {contentDiscussionArr &&
                    <div className={classes.root}>
                        <Tabs
                            orientation="vertical"
                            value={value}
                            onChange={handleChange}
                            aria-label="Vertical tabs example"
                            className={`${classes.tabs} col-3 col-sm-3 col-md-2`}

                        >

                            <Tab label="Content Discussion" {...a11yProps(0)} />
                            <Tab label="Add New Post" {...a11yProps(1)} />
                        </Tabs>



                        <TabPanel value={value} index={0} className="col-10 col-sm-9 col-md-10">
                            {(contentDiscussionArr.reverse()).map(discussionID => {
                                return <Discussion key={discussionID} discussionID={discussionID} />
                            })}
                        </TabPanel>

                        <TabPanel value={value} index={1} className="col-sm-9 col-md-7">
                            <PostContentDiscussion />
                        </TabPanel>

                    </div>}
            </div>
        </div >
    )
}

export default ContentDiscussion
