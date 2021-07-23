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
import Plyr from 'plyr';

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
                const player = new Plyr('#player');
            })
            .catch(err => console.log(err))

    }, [])

    // const supported = Plyr.supported('video', 'html5', true);

    // document.addEventListener('DOMContentLoaded', () => {
    //     // This is the bare minimum JavaScript. You can opt to pass no arguments to setup.
    //     // Expose
    //     window.player = player;

    // });

    return (
        <div>

            {content &&
                <div className="container">

                    <div className="containerPlayer">
                        <video controls
                            crossorigin
                            playsinline
                            id="player"
                        // poster="https://cdn.plyr.io/static/demo/View_From_A_Blue_Moon_Trailer-HD.jpg" 
                        >

                            <source src={`/uploads/${content.file.filename}`}
                                size="240"></source>
                            <source src={`/uploads/${content.file.filename}`}
                                size="360"></source>
                            <source src={`/uploads/${content.file.filename}`}
                                size="720"></source>
                            <source src={`/uploads/${content.file.filename}`}
                                size="1080"></source>

                            {/* {content &&
                            <>
                                <source src={`/uploads/${content.file.filename}`}
                                    size="576"></source>
                                <source src={`/uploads/${content.file.filename}`}
                                    size="720"></source>
                                <source src={`/uploads/${content.file.filename}`}
                                    size="1080"></source>
                                <source src={`/uploads/${content.file.filename}`}
                                    size="1440"></source>
                            </>
                        } */}

                        </video>
                    </div>

                    <div className="mt-5">
                        {(content.discussion.reverse()).map(discussionID => {
                            return <Discussion key={discussionID} discussionID={discussionID} />
                        })}
                    </div>
                </div>
            }

            {/* {content &&
                <div className="container">
                    <h1 className="title">Watch Video</h1>
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
            } */}

        </div>
    )
}

export default Watch
