import React, { useState, useEffect } from 'react'
import axios from "axios";

const Upload = () => {
    const [tag, setTag] = useState("");
    const [title, setTitle] = useState("");
    const [file, setFile] = useState();

    const auth = {
        headers: {
            token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYwZDk2MzllODg2ODQ2MmEyNDQ1ZWFmYSIsInJvbGUiOiJzdGFmZiIsImlhdCI6MTYyNDg3NDEwNH0.5SqvAPYQ9jT_nqynuYCxMYT5vYXFMNeWJb6PaNR_I40"
        }
    }

    const handelSubmit = (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("tag", tag)
        formData.append("title", title)
        formData.append("file", file)
        // const formData = { tag, title, file };
        axios.post("http://localhost:8080/contents/upload/60dc8be6a091403cf83921ec", formData, auth)
            .then((res) => console.log(res.data))
            .catch((err) => console.log(err.response.data));

        // setTag("")
        // setTitle("")
        // setFile()
    };
    return (
        <div className="container">
            <form onSubmit={handelSubmit} encType="multipart/form-data">
                <div>
                    <label className="form-label" htmlFor="tag">
                        tag
                    </label>
                    <input
                        className="form-control"
                        type="text"
                        id="tag"
                        value={tag}
                        onChange={(event) => setTag(event.target.value)}
                    ></input>
                </div>
                <div>
                    <label className="form-label" htmlFor="title">
                        title
                    </label>
                    <input
                        className="form-control"
                        type="text"
                        id="title"
                        value={title}
                        onChange={(event) => setTitle(event.target.value)}
                    ></input>
                </div>
                <div>
                    <label className="form-label" htmlFor="file">
                        file
                    </label>
                    <input
                        className="form-control"
                        type="file"
                        id="file"
                        name="file"
                        onChange={(event) => setFile(event.target.files[0])}
                    ></input>
                </div>
                <button type="submit" className="btn btn-primary mt-3">
                    Submit
                </button>
            </form>
        </div>
    )
}

export default Upload
