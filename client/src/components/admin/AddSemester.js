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

const AddSemester = () => {
    const [season, setSeason] = useState("");
    const [year, setYear] = useState("");
    const [open, setOpen] = useState(false);


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

        const data = { season, year };
        axios.post("http://localhost:8080/semesters/", data, auth)
            .then((res) => console.log(res.data))
            .catch((err) => console.log(err.response.data));
        setOpen(true)
        setSeason("");
        setYear("");
    };

    return (
        <div className="container-fluid" style={{ margin: "auto 50%", alignItems: 'center' }}>
            <form onSubmit={handelSubmit}>
                <InputLabel id="demo-simple-select-label" className="mt-4">Season</InputLabel>
                <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    // align="center"
                    fullWidth
                    value={season}
                    onChange={(event) => setSeason(event.target.value)}
                >
                    <MenuItem value="Winter">Winter</MenuItem>
                    <MenuItem value="Spring">Spring</MenuItem>
                    <MenuItem value="Summer">Summer</MenuItem>
                </Select>

                <TextField
                    align="center"
                    label="Year"
                    id="standard-textarea"
                    // placeholder="Course Name .."
                    multiline
                    fullWidth
                    className="mt-3"
                    value={year}
                    onChange={(event) => setYear(event.target.value)}
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
                        Semester added successfully !
                    </Alert>
                </Snackbar>
            </form>
        </div>
    );
}

export default AddSemester
