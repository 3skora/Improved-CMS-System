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
import PostDiscussion from "./PostDiscussion";
import CircularProgress from '@material-ui/core/CircularProgress';



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
    progress: {
        display: 'flex',
        margin: "0% auto",
        alignItems: "center",
        position: "absolute",
        top: "50%",
        bottom: "50%",
        right: "50%",
        '& > * + *': {
            marginLeft: theme.spacing(2),
        }
    },
}));


const AllDiscussions = () => {
    let reversed = [];
    const classes = useStyles();
    const [value, setValue] = useState(0);

    const [allCourses, setAllCourses] = useState();
    const [activities, setActivities] = useState();

    const token = localStorage.getItem('token')
    const userID = localStorage.getItem('userID')


    const auth = {
        headers: { token }
    }

    useEffect(() => {
        axios.get(`http://localhost:8080/discussion/users/${userID}`, auth)
            .then(res => {
                setAllCourses(res.data)
            })
            .catch(err => console.log(err.response.data))

        axios.get(`http://localhost:8080/discussion/users/activities/${userID}`, auth)
            .then(res => {
                setActivities(res.data.reverse())
            })
            .catch(err => console.log(err.response.data))

    }, [allCourses])

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };



    return (
        <div className="container-fluid">
            <div className="row">
                {allCourses &&
                    <div className={`${classes.root}`}>
                        <Tabs
                            orientation="vertical"
                            value={value}
                            onChange={handleChange}
                            aria-label="Vertical tabs example"
                            className={`${classes.tabs} col-3 col-sm-3 col-md-2`}

                        >
                            {allCourses.map((course, index) => {
                                return <Tab key={index} label={`${course.name} (${course.code})`} {...a11yProps(index)} />
                            })}

                            <Divider className={classes.myDivider} component="p" variant="middle" />
                            <Tab label="View Your Activity" {...a11yProps(allCourses.length + 1)} />
                            <Tab label="Add New Post" {...a11yProps(allCourses.length + 2)} />
                        </Tabs>


                        {allCourses.map((course, index) => {
                            return <TabPanel value={value} index={index} className="col-10 col-sm-9 col-md-10">
                                {(course.discussion).map(discussionID => {
                                    return <Discussion key={discussionID} discussionID={discussionID} />
                                })}
                            </TabPanel>
                        })}

                        <TabPanel value={value} index={allCourses.length + 1} className="col-10 col-sm-9 col-md-10">

                            {activities.map(discussionID => {
                                return <Discussion key={discussionID} discussionID={discussionID} />
                            })}

                        </TabPanel>
                        <TabPanel value={value} index={allCourses.length + 2} className="col-sm-9 col-md-7">
                            <PostDiscussion />
                        </TabPanel>

                    </div>}
            </div>
        </div >
    )
}

export default AllDiscussions
