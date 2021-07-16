import React, { useState, useEffect } from 'react'
import axios from "axios";
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    useHistory,
    useLocation,
    useParams,
} from "react-router-dom";
import Discussion from './Discussion';
import Grid from '@material-ui/core/Grid';

const Watch = () => {
    const [content, setContent] = useState();
    const { folderID, contentID } = useParams()
    const token = localStorage.getItem('token')


    const auth = {
        headers: { token }
    }

    useEffect(() => {
        axios.get(`http://localhost:8080/contents/${contentID}`, auth)
            .then(res => {
                setContent(res.data)
            })
            .catch(err => console.log(err))

    }, [])
    console.log("🚀 ~ file: Watch.js ~ line 17 ~ Watch ~ folderID", folderID)
    console.log("🚀 ~ file: Watch.js ~ line 17 ~ Watch ~ contentID", contentID)
    return (
        <div>
            {content &&
                <div className="container">
                    {/* <h1 className="title">Watch Video</h1> */}
                    <div>
                        <video width="1200"
                            height="520"
                            controls
                            src={`/uploads/${content.file.filename}`}>
                        </video>
                    </div>

                    <div className="mt-5">
                        {(content.discussion.reverse()).map(discussionID => {
                            return <Discussion key={discussionID} discussionID={discussionID} />
                        })}
                    </div>
                </div>
            }
        </div>
    )
}

export default Watch
