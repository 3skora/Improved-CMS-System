import React, { useState, useEffect } from "react";
import axios from "axios";
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import MenuItem from '@material-ui/core/MenuItem';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}



const AssignCourses = (props) => {
    const [user, setUser] = useState("");
    const [course, setCourse] = useState("");
    const [allUsers, setAllUsers] = useState([]);
    const [allCourses, setAllCourses] = useState([]);

    const token = localStorage.getItem('token')
    const userID = localStorage.getItem('userID')
    const role = localStorage.getItem('role')

    const auth = {
        headers: { token }
    }

    const [open, setOpen] = React.useState(false);




    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpen(false);
    };

    useEffect(() => {
        if (props.role === "student") {
            axios.get("http://localhost:8080/users/allStudents", auth)
                .then(res => setAllUsers(res.data))
                .catch(err => console.log(err.response.data))
        }

        if (props.role === "staff") {
            axios.get("http://localhost:8080/users/allStaff", auth)
                .then(res => setAllUsers(res.data))
                .catch(err => console.log(err.response.data))
        }


        axios.get("http://localhost:8080/courses/find/all", auth)
            .then(res => setAllCourses(res.data))
            .catch(err => console.log(err.response.data))
    }, [])

    const handelSubmit = async (e) => {
        e.preventDefault();
        try {
            const data = { user, course, role: props.role };

            const res = await axios.post("http://localhost:8080/courses/assignCoursesForAll", data, auth)
            console.log(res.data);
            setOpen(true)
            setUser("")
            setCourse("")
        } catch (error) {
            console.log(error.response.data)
        }

    };

    return (
        <div className="container" style={{ margin: "auto 200px", alignItems: 'center' }}>
            <form onSubmit={handelSubmit}>

                <TextField
                    id="standard-select-currency"
                    select
                    fullWidth
                    // variant="outlined"
                    label="select user"
                    className="mt-3"
                    value={user}
                    onChange={(event) => setUser(event.target.value)}
                // helperText="Please select your course"
                >
                    {allUsers && allUsers.map(user => (
                        <MenuItem key={user._id} value={user._id}>
                            {user.firstName} {user.lastName} {user._id}
                        </MenuItem>
                    ))}
                </TextField>
                {/* <div>
                    <label className="form-label" htmlFor="user">
                        user
                    </label>
                    <select
                        className="form-select"
                        id="user"
                        value={user}
                        onChange={(event) => setUser(event.target.value)}
                    >
                        <option value="">--select user--</option>
                        {allUsers.map(user => {
                            return <option key={user._id} value={user._id}> {user.name} </option>
                        })}
                    </select>
                </div> */}




                <TextField
                    id="standard-select-currency"
                    select
                    fullWidth
                    // variant="outlined"
                    label="select course"
                    className="mt-3"
                    value={course}
                    onChange={(event) => setCourse(event.target.value)}
                // helperText="Please select your course"
                >
                    {allCourses && allCourses.map(course => (
                        <MenuItem key={course._id} value={course._id}>
                            {course.name} - {course.code}
                        </MenuItem>
                    ))}
                </TextField>
                {/* <div>
                    <label className="form-label" htmlFor="course">
                        course
                    </label>
                    <select
                        className="form-select"
                        id="course"
                        value={course}
                        onChange={(event) => setCourse(event.target.value)}
                    >
                        <option value="">--select course--</option>
                        {allCourses.map(course => {
                            return <option key={course._id} value={course._id}> {course.season} - {course.year} </option>
                        })}
                    </select>
                </div> */}





                <Button size="medium"
                    className="mt-5"
                    variant="contained"
                    color="primary"
                    onClick={handelSubmit}>
                    Submit
                </Button>

                <Snackbar open={open} autoHideDuration={3000} onClose={handleClose}>
                    <Alert onClose={handleClose} severity="success">
                        Course assigned successfully !
                    </Alert>
                </Snackbar>
                {/* <button type="submit" className="btn btn-primary mt-3">
                    Submit
                </button> */}
            </form>
        </div>
    );
};

export default AssignCourses;
