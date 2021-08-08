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



const Course = () => {
    const [name, setName] = useState("");
    const [code, setCode] = useState("");
    const [department, setDepartment] = useState("");
    const [semester, setSemester] = useState("");
    const [AllDepartments, setAllDepartments] = useState([]);
    const [AllSemesters, setAllSemesters] = useState([]);

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
        axios.get("http://localhost:8080/departments/all", auth)
            .then(res => setAllDepartments(res.data))
            .catch(err => console.log(err.response.data))

        axios.get("http://localhost:8080/semesters/all", auth)
            .then(res => setAllSemesters(res.data))
            .catch(err => console.log(err.response.data))
    }, [])

    const handelSubmit = async (e) => {
        e.preventDefault();
        try {
            const data = { name, code, department, semester };
            const res = await axios.post("http://localhost:8080/courses", data, auth)
            console.log(res.data);
            setOpen(true)
            setCode("")
            setName("")
            setDepartment("")
            setSemester("")
        } catch (error) {
            console.log(error.response.data)
        }

    };

    return (
        <div className="container-fluid" style={{ margin: "auto 20%", alignItems: 'center' }}>
            <form onSubmit={handelSubmit}>
                <TextField
                    align="center"
                    label="Course Name"
                    id="standard-textarea"
                    // placeholder="Course Name .."
                    multiline
                    fullWidth
                    value={name}
                    className="mt-3"
                    onChange={(event) => setName(event.target.value)}
                />
                {/* <div>
                    <label className="form-label" htmlFor="name">
                        name
                    </label>
                    <input
                        className="form-control"
                        type="text"
                        id="name"
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                    ></input>
                </div> */}




                <TextField
                    align="center"
                    label="Course Code"
                    id="standard-textarea"
                    // placeholder="Course Name .."
                    multiline
                    fullWidth
                    value={code}
                    className="mt-3"
                    onChange={(event) => setCode(event.target.value)}
                />
                {/* <div>
                    <label className="form-label" htmlFor="code">
                        code
                    </label>
                    <input
                        className="form-control"
                        type="text"
                        id="code"
                        value={code}
                        onChange={(event) => setCode(event.target.value)}
                    ></input>
                </div> */}




                <TextField
                    id="standard-select-currency"
                    select
                    fullWidth
                    // variant="outlined"
                    label="select department"
                    className="mt-3"
                    value={department}
                    onChange={(event) => setDepartment(event.target.value)}
                // helperText="Please select your course"
                >
                    {AllDepartments && AllDepartments.map(department => (
                        <MenuItem key={department._id} value={department._id}>
                            {department.name}
                        </MenuItem>
                    ))}
                </TextField>
                {/* <div>
                    <label className="form-label" htmlFor="department">
                        department
                    </label>
                    <select
                        className="form-select"
                        id="department"
                        value={department}
                        onChange={(event) => setDepartment(event.target.value)}
                    >
                        <option value="">--select Department--</option>
                        {AllDepartments.map(department => {
                            return <option key={department._id} value={department._id}> {department.name} </option>
                        })}
                    </select>
                </div> */}




                <TextField
                    id="standard-select-currency"
                    select
                    fullWidth
                    // variant="outlined"
                    label="select semester"
                    className="mt-3"
                    value={semester}
                    onChange={(event) => setSemester(event.target.value)}
                // helperText="Please select your course"
                >
                    {AllSemesters && AllSemesters.map(semester => (
                        <MenuItem key={semester._id} value={semester._id}>
                            {semester.season} - {semester.year}
                        </MenuItem>
                    ))}
                </TextField>
                {/* <div>
                    <label className="form-label" htmlFor="semester">
                        semester
                    </label>
                    <select
                        className="form-select"
                        id="semester"
                        value={semester}
                        onChange={(event) => setSemester(event.target.value)}
                    >
                        <option value="">--select Semester--</option>
                        {AllSemesters.map(semester => {
                            return <option key={semester._id} value={semester._id}> {semester.season} - {semester.year} </option>
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
                        Course added successfully !
                    </Alert>
                </Snackbar>
                {/* <button type="submit" className="btn btn-primary mt-3">
                    Submit
                </button> */}
            </form>
        </div>
    );
};

export default Course;
