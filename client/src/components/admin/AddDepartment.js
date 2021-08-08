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

const AddDepartment = () => {
    const [name, setName] = useState("");

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


    const handelSubmit = async (e) => {
        e.preventDefault();
        try {
            const data = { name };

            const res = await axios.post("http://localhost:8080/departments", data, auth)
            console.log(res.data);
            setOpen(true)
            setName("")
        } catch (error) {
            console.log(error.response.data)
        }

    };



    return (
        <div className="container" style={{ margin: "auto 200px", alignItems: 'center' }}>
            <form onSubmit={handelSubmit}>
                <TextField
                    align="center"
                    label="Department Name"
                    id="standard-textarea"
                    // placeholder="Course Name .."
                    multiline
                    fullWidth
                    value={name}
                    className="mt-3"
                    onChange={(event) => setName(event.target.value)}
                />

                <Button size="medium"
                    className="mt-5"
                    variant="contained"
                    color="primary"
                    onClick={handelSubmit}>
                    Submit
                </Button>

                <Snackbar open={open} autoHideDuration={3000} onClose={handleClose}>
                    <Alert onClose={handleClose} severity="success">
                        Department Added successfully !
                    </Alert>
                </Snackbar>
                {/* <button type="submit" className="btn btn-primary mt-3">
                    Submit
                </button> */}
            </form>
        </div>
    );
}

export default AddDepartment
