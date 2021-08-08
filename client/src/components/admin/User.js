import React, { useState, useEffect } from "react";
import axios from "axios";
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import MenuItem from '@material-ui/core/MenuItem';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}






const User = () => {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [role, setRole] = useState("");
    const [gucID, setGucID] = useState("");
    const [open, setOpen] = useState(false);
    // const [result, setResult] = useState(null)

    const token = localStorage.getItem('token')
    const userID = localStorage.getItem('userID')

    const auth = {
        headers: { token }
    }

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpen(false);
    };

    const handelSubmit = (e) => {
        e.preventDefault();

        const data = { firstName, lastName, email, role, gucID, password: "123456" };
        axios.post("http://localhost:8080/users/", data, auth)
            .then((res) => console.log(res.data))
            .catch((err) => console.log(err.response.data));
        setOpen(true)
        setFirstName("");
        setLastName("");
        setEmail("");
        setRole("");
        setGucID("");
        // setResult(null)
    };

    return (
        <div className="container-fluid" style={{ margin: "auto 20%", alignItems: 'center' }}>
            <form onSubmit={handelSubmit}>
                <TextField
                    align="center"
                    label="First Name"
                    id="standard-textarea"
                    // placeholder="Course Name .."
                    multiline
                    fullWidth
                    className="mt-3"
                    value={firstName}
                    onChange={(event) => setFirstName(event.target.value)}
                />
                {/* <div>
                    <label className="form-label" htmlFor="firstName">
                        firstName
                    </label>
                    <input
                        className="form-control"
                        type="text"
                        id="firstName"
                        value={firstName}
                        onChange={(event) => setFirstName(event.target.value)}
                    ></input>
                </div> */}

                <TextField
                    align="center"
                    label="Last Name"
                    id="standard-textarea"
                    // placeholder="Course Name .."
                    multiline
                    fullWidth
                    className="mt-3"
                    value={lastName}
                    onChange={(event) => setLastName(event.target.value)}
                />
                {/* <div>
                    <label className="form-label" htmlFor="lastName">
                        lastName
                    </label>
                    <input
                        className="form-control"
                        type="text"
                        id="lastName"
                        value={lastName}
                        onChange={(event) => setLastName(event.target.value)}
                    ></input>
                </div> */}

                <TextField
                    align="center"
                    label="Email"
                    id="standard-textarea"
                    // placeholder="Course Name .."
                    multiline
                    fullWidth
                    className="mt-3"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                />
                {/* <div>
                    <label className="form-label" htmlFor="email">
                        email
                    </label>
                    <input
                        className="form-control"
                        type="text"
                        id="email"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                    ></input>
                </div> */}

                {/* 
                <TextField
                    align="center"
                    label="Role"
                    id="standard-textarea"
                    // placeholder="Course Name .."
                    multiline
                    fullWidth
                    className="mt-3"
                    value={role}
                    onChange={(event) => setRole(event.target.value)}
                /> */}
                {/* <div>
                    <label className="form-label" htmlFor="role">
                        role
                    </label>
                    <input
                        className="form-control"
                        type="text"
                        id="role"
                        value={role}
                        onChange={(event) => setRole(event.target.value)}
                    ></input>
                </div> */}

                <TextField
                    align="center"
                    label="GUC ID"
                    id="standard-textarea"
                    // placeholder="Course Name .."
                    multiline
                    fullWidth
                    className="mt-3"
                    value={gucID}
                    onChange={(event) => setGucID(event.target.value)}
                />
                {/* <div>
                    <label className="form-label" htmlFor="gucID">
                        gucID
                    </label>
                    <input
                        className="form-control"
                        type="text"
                        id="gucID"
                        value={gucID}
                        onChange={(event) => setGucID(event.target.value)}
                    ></input>
                </div> */}

                <InputLabel id="demo-simple-select-label" className="mt-4">Role</InputLabel>
                <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    // align="center"
                    fullWidth
                    value={role}
                    onChange={(event) => setRole(event.target.value)}
                >
                    <MenuItem value="student">Student</MenuItem>
                    <MenuItem value="staff">Staff</MenuItem>
                </Select>

                <Button size="medium"
                    className="mt-5"
                    variant="contained"
                    color="primary"
                    onClick={handelSubmit}>
                    Submit
                </Button>

                <Snackbar open={open} autoHideDuration={3000} onClose={handleClose}>
                    <Alert onClose={handleClose} severity="success">
                        User added successfully !
                    </Alert>
                </Snackbar>
                {/* <button type="submit" className="btn btn-primary mt-3">
                    Submit
                </button> */}
            </form>
        </div>
    );
};

export default User;
