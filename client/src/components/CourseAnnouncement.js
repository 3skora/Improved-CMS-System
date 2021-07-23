import React, { useState, useEffect } from "react";
import axios from "axios";
import Announcement from './Announcement'
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import AppBar from '@material-ui/core/AppBar';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';
import PostAnnouncement from "./PostAnnouncement";


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
        // paddingLeft: 0,


    },
    tabs: {
        // paddingLeft: 0,
        borderRight: `1px solid ${theme.palette.divider}`,
    },
    myDivider: {
        margin: "10px 0px",
        border: `1px solid ${theme.palette.divider}`
    }
}));


const CourseAnnouncement = () => {
    let reversed = [];
    const classes = useStyles();
    const [value, setValue] = useState(0);

    const [allAnnouncements, setAllAnnouncements] = useState();

    const token = localStorage.getItem('token')
    const userID = localStorage.getItem('userID')
    const role = localStorage.getItem('role')


    const auth = {
        headers: { token }
    }

    useEffect(() => {
        axios.get(`http://localhost:8080/courses/courseAnnouncements/${userID}`, auth)
            .then(res => {
                setAllAnnouncements(res.data)
            })
            .catch(err => console.log(err.response.data))

    }, [allAnnouncements])

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };



    return (
        <div>
            {allAnnouncements &&
                <div className={classes.root}>
                    <Tabs
                        orientation="vertical"
                        value={value}
                        onChange={handleChange}
                        aria-label="Vertical tabs example"
                        className={classes.tabs}

                    >
                        {allAnnouncements.map((course, index) => {
                            return <Tab key={index} label={`${course.name} (${course.code})`} {...a11yProps(index)} />
                        })}

                        {role === "staff" && <Divider className={classes.myDivider} component="p" variant="middle" />}
                        {role === "staff" && <Tab label="Add New Announcement" {...a11yProps(allAnnouncements.length + 1)} />}

                    </Tabs>


                    {allAnnouncements.map((course, index) => {
                        return <TabPanel value={value} index={index}>
                            {course.courseAnnouncement.length === 0 ?
                                <Typography variant="subtitle1" component="p">
                                    No Announcements Yet..
                                </Typography>
                                :
                                (course.courseAnnouncement).map((text, index2) => {
                                    return <Announcement key={index2} text={text} />
                                })
                            }
                        </TabPanel>
                    })}


                    <TabPanel value={value} index={allAnnouncements.length + 1}>
                        <PostAnnouncement />
                    </TabPanel>
                </div>}
        </div >
    )
}

export default CourseAnnouncement
