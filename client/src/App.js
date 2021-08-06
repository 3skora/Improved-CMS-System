import React, { useState, useEffect } from "react";
import axios from "axios";

import HomeAdmin from "./pages/admin/HomeAdmin";
import HomeStudent from "./pages/student/HomeStudent";
import HomeStaff from "./pages/staff/HomeStaff";
import Upload from "./components/staff/Upload";
import Video from "./components/student/Video";
import ContentCard from "./components/Content";
import Folder from "./components/Folder";
import Footer from "./components/Footer";
import Login from "./components/Login";
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useLocation,
  useParams,
} from "react-router-dom";
import { Redirect } from 'react-router'

// const [token, setToken] = useState()
// const [user, setUser] = useState()

// useEffect(() => {
//   axios.get(`http://localhost:8080/login`)
//     .then(res => {
//       setToken(res.data.token)
//       setUser(res.data.user)
//     })
//     .catch(err => console.log(err.response.data))

// }, [])



function App() {
  // const role = "admin"

  const [token, setToken] = useState(localStorage.getItem('token'))
  const [role, setRole] = useState(localStorage.getItem('role'))
  const [userID, setUserID] = useState(localStorage.getItem('userID'))
  const [userFullName, setUserFullName] = useState(localStorage.getItem('userFullName'))

  const setTokenFn = (token, role, userID, userFullName) => {
    localStorage.setItem('token', token);
    localStorage.setItem('role', role);
    localStorage.setItem('userID', userID);
    localStorage.setItem('userFullName', userFullName);

    setToken(token);
    setRole(role);
    setUserID(userID)
    setUserFullName(userFullName)
  };

  return (

    <Router>

      <Switch>

        {/* redirection */}
        <Route exact path="/login">
          {
            token && role === "admin" ? <Redirect to="/homeAdmin" />
              : token && role !== "admin" ? <Redirect to="/dashboard/" />
                : <Login setToken={setTokenFn} />
          }
        </Route>





        <Route exact path="/homeAdmin">
          {
            token ?
              <HomeAdmin token={token} userID={userID} />
              : <Redirect to="/login" />
          }
        </Route>




        {/* student routes */}
        <Route exact path="/">
          {
            token && role !== "admin" ?
              <Redirect to="/dashboard/" />
              : <Redirect to="/login" />
          }
        </Route>

        <Route exact path="/dashboard/">
          {
            token && role !== "admin" ?
              <HomeStudent token={token} userID={userID} selectedTab={0} search={false} />
              : <Redirect to="/login" />
          }
        </Route>

        <Route exact path="/discussion">
          {
            token ?
              <HomeStudent token={token} userID={userID} selectedTab={1} type="general" />
              : <Redirect to="/login" />
          }
        </Route>

        <Route exact path="/discussion/:discussionID">
          {
            token ?
              <HomeStudent token={token} userID={userID} selectedTab={1} notification={true} />
              : <Redirect to="/login" />
          }
        </Route>

        <Route exact path="/discussion/content/:contentID">
          {
            token ?
              <HomeStudent token={token} userID={userID} selectedTab={1} type="content" />
              : <Redirect to="/login" />
          }
        </Route>

        <Route exact path="/notifications">
          {
            token ?
              <HomeStudent token={token} userID={userID} selectedTab={3} />
              : <Redirect to="/login" />
          }
        </Route>

        <Route exact path="/dashboard/:folderID">
          {
            token ?
              <HomeStudent token={token} userID={userID} selectedTab={0} search={false} />
              : <Redirect to="/login" />
          }
        </Route>

        <Route exact path="/dashboard/:folderID/watch/:contentID">
          {
            token ?
              <HomeStudent token={token} userID={userID} selectedTab={0} search={false} watch={true} />
              : <Redirect to="/login" />
          }
        </Route>

        <Route exact path="/dashboard/search/:q">
          {
            token ?
              <HomeStudent token={token} userID={userID} selectedTab={0} search={true} />
              : <Redirect to="/login" />
          }
        </Route>

        <Route exact path="/announcements">
          {
            token ?
              <HomeStudent token={token} userID={userID} selectedTab={2} allAnnouncements={true} />
              : <Redirect to="/login" />
          }
        </Route>
        <Route exact path="/announcements/:courseID/:courseAnnouncementIndex">
          {
            token ?
              <HomeStudent token={token} userID={userID} selectedTab={2} allAnnouncements={false} />
              : <Redirect to="/login" />
          }
        </Route>



        {/* staff routes */}

        <Route exact path="/">
          {
            token ?
              <Redirect to="/dashboard/" />
              : <Redirect to="/login" />
          }
        </Route>

        <Route exact path="/dashboard/">
          {
            token ?
              <HomeStaff token={token} userID={userID} selectedTab={0} search={false} />
              : <Redirect to="/login" />
          }
        </Route>

        <Route exact path="/dashboard/:folderID">
          {
            token ?
              <HomeStaff token={token} userID={userID} selectedTab={0} search={false} />
              : <Redirect to="/login" />
          }
        </Route>

        <Route exact path="/dashboard/:folderID/watch/:contentID">
          {
            token ?
              <HomeStaff token={token} userID={userID} selectedTab={0} search={false} watch={true} />
              : <Redirect to="/login" />
          }
        </Route>

        <Route exact path="/dashboard/search/:q">
          {
            token ?
              <HomeStaff token={token} userID={userID} selectedTab={0} search={true} />
              : <Redirect to="/login" />
          }
        </Route>


        <Route exact path="/discussion">
          {
            token ?
              <HomeStaff token={token} userID={userID} selectedTab={1} type="general" />
              : <Redirect to="/login" />
          }
        </Route>
        <Route exact path="/discussion/:discussionID">
          {
            token ?
              <HomeStaff token={token} userID={userID} selectedTab={1} notification={true} />
              : <Redirect to="/login" />
          }
        </Route>
        <Route exact path="/discussion/content/:contentID">
          {
            token ?
              <HomeStaff token={token} userID={userID} selectedTab={1} type="content" />
              : <Redirect to="/login" />
          }
        </Route>

        <Route exact path="/notifications">
          {
            token ?
              <HomeStaff token={token} userID={userID} selectedTab={3} />
              : <Redirect to="/login" />
          }
        </Route>
        <Route exact path="/announcements">
          {
            token ?
              <HomeStudent token={token} userID={userID} selectedTab={2} allAnnouncements={true} />
              : <Redirect to="/login" />
          }
        </Route>
        <Route exact path="/announcements/:courseID/:courseAnnouncementIndex">
          {
            token ?
              <HomeStudent token={token} userID={userID} selectedTab={2} allAnnouncements={false} />
              : <Redirect to="/login" />
          }
        </Route>

      </Switch>
    </Router>

  );
}

export default App;
