import React, { useState, useEffect } from "react";
import axios from "axios";

const User = () => {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [role, setRole] = useState("");
    const [gucID, setGucID] = useState("");
    // const [result, setResult] = useState(null)

    const handelSubmit = (e) => {
        e.preventDefault();

        const data = { firstName, lastName, email, role, gucID };
        axios.post("http://localhost:8080/users/", data)
            .then((res) => console.log(res.data))
            .catch((err) => console.log(err.response.data));

        // setFirstName("");
        // setLastName("");
        // setEmail("");
        // setRole("");
        // setGucID("");
        // setResult(null)
    };

    return (
        <div className="container">
            <form onSubmit={handelSubmit}>
                <div>
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
                </div>
                <div>
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
                </div>
                <div>
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
                </div>
                <div>
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
                </div>
                <div>
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
                </div>
                <button type="submit" className="btn btn-primary mt-3">
                    Submit
                </button>
            </form>
        </div>
    );
};

export default User;
