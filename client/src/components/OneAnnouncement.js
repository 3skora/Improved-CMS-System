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
import { useLocation, useParams } from "react-router-dom";

const OneAnnouncement = () => {
    const [announcement, setAnnouncement] = useState();

    const token = localStorage.getItem('token')
    const userID = localStorage.getItem('userID')
    const role = localStorage.getItem('role')


    const auth = {
        headers: { token }
    }

    let { courseID, courseAnnouncementIndex } = useParams()

    useEffect(() => {
        axios.get(`http://localhost:8080/courses/courseAnnouncement/${courseID}`, auth)
            .then(res => {
                setAnnouncement(res.data[res.data.length - courseAnnouncementIndex])
            })
            .catch(err => console.log(err.response.data))

    }, [announcement])

    return (
        <>
            <Announcement text={announcement} />
        </>
    )
}

export default OneAnnouncement
