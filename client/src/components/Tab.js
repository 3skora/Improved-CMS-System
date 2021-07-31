import React, { useState, useEffect } from "react";
import axios from "axios";
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import Dashboard from "./Dashboard"
import NotificationPage from './NotificationPage'
import AllDiscussions from "./AllDiscussions"
import SearchResult from "./SearchResult"
import Watch from "./Watch"
import VideoPlayer from "./VideoPlayer"
import VideoDiscussion from "./VideoDiscussion"
import Search from "./Search"
import ContentDiscussion from "./ContentDiscussion";
import { useHistory } from "react-router";
import Discussion from "./Discussion";
import { useLocation, useParams } from "react-router-dom";
import CourseAnnouncement from "./CourseAnnouncement"


function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
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
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.paper,
    },
}));

export default function SimpleTabs({ selectedTab, type, search, watch, notification }) {
    const classes = useStyles();
    const [value, setValue] = React.useState(selectedTab);
    let history = useHistory()
    let location = useLocation()

    const handleClickNotifications = () => {
        history.push("/notifications")
    }

    const handleClickDashboard = () => {
        history.push("/dashboard/")
    }

    const handleClickDiscussion = () => {
        history.push("/discussion")
    }

    const handleClickCourseAnnouncement = () => {
        history.push("/announcements")
    }


    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    let { discussionID } = useParams()

    useEffect(() => {

    }, [location])

    return (
        <div className={classes.root}>
            <AppBar position="static">
                <Search />
                <Tabs centered value={value} onChange={handleChange} aria-label="simple tabs example">
                    <Tab label="Dashboard" onClick={handleClickDashboard}  {...a11yProps(0)} />
                    <Tab label="Discussion" onClick={handleClickDiscussion} default {...a11yProps(1)} />
                    <Tab label="Announcements" onClick={handleClickCourseAnnouncement} {...a11yProps(2)} />
                    <Tab label="Notifications" onClick={handleClickNotifications} {...a11yProps(3)} />
                </Tabs>
            </AppBar>
            <TabPanel value={value} index={0} >
                {search ? <SearchResult /> : watch ? <VideoDiscussion /> : <Dashboard />}
            </TabPanel>
            <TabPanel value={value} index={1}>
                {notification ? <Discussion discussionID={discussionID} /> : type === "general" ? <AllDiscussions /> : <ContentDiscussion />}
            </TabPanel>
            <TabPanel value={value} index={2}>
                <CourseAnnouncement />
            </TabPanel>
            <TabPanel value={value} index={3}>
                <NotificationPage />
            </TabPanel>


        </div>
    );
}