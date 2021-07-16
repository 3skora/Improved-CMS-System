import React from "react";
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
} from "react-router-dom";

import User from "../../components/admin/User";
import Course from "../../components/admin/Course"
import AssignCourses from "../../components/admin/AssignCourses"

import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Box from '@material-ui/core/Box';
import PropTypes from 'prop-types';
import AccountMenu from "../../components/AccountMenu";


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
    rootAppBar: {
        flexGrow: 1,
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    title: {
        flexGrow: 1,
    },
    root: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.paper,
        display: 'flex',
        height: 224,
    },
    tabs: {
        borderRight: `1px solid ${theme.palette.divider}`,
    },
}));


const HomeAdmin = () => {
    const classes = useStyles();
    const [value, setValue] = React.useState(0);
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
    const fullName = localStorage.getItem('userFullName')

    return (
        <div>

            <div className={classes.rootAppBar}>
                <AppBar position="static">
                    <Toolbar>
                        <AccountMenu />

                        <Typography variant="h6" className={classes.title}>
                            {fullName}
                        </Typography>

                        <Typography variant="h6" className={classes.title}>
                            GUC Content Management System
                        </Typography>

                    </Toolbar>
                </AppBar>
            </div>
            <div className={classes.root}>
                <Tabs
                    orientation="vertical"
                    value={value}
                    onChange={handleChange}
                    aria-label="Vertical tabs example"
                    className={classes.tabs}
                // variant="scrollable"
                >
                    <Tab label="Add Course" {...a11yProps(0)} />
                    <Tab label="Add User" {...a11yProps(1)} />
                    <Tab label="Assign Student Courses" {...a11yProps(2)} />
                    <Tab label="Assign staff Courses" {...a11yProps(3)} />
                    <Tab label="Item Five" {...a11yProps(4)} />
                </Tabs>
                <TabPanel value={value} index={0}>
                    <Course />
                </TabPanel>
                <TabPanel value={value} index={1}>
                    <User />
                </TabPanel>
                <TabPanel value={value} index={2}>
                    <AssignCourses role="student" />
                </TabPanel>
                <TabPanel value={value} index={3}>
                    <AssignCourses role="staff" />
                </TabPanel>
                <TabPanel value={value} index={4}>
                    Item Five
                </TabPanel>
            </div>

        </div>
    );
}

export default HomeAdmin

{/* <Router>
                <Link className="btn btn-outline-primary btn-lg m-2" role="button" to="/courses">add course</Link>
                <Link className="btn btn-outline-primary btn-lg m-2" role="button" to="/users"> add user</Link>
                <Switch>
                    <Route exact path='/courses'>
                        <Course />
                    </Route>
                    <Route exact path='/users'>
                        <User />
                    </Route>
                </Switch>
            </Router> */}