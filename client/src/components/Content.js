import React, { useState, useEffect } from 'react'
import axios from "axios";
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import OndemandVideoRoundedIcon from '@material-ui/icons/OndemandVideoRounded';
import GetAppRoundedIcon from '@material-ui/icons/GetAppRounded';
import ForumRoundedIcon from '@material-ui/icons/ForumRounded';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    useHistory,
    useLocation,
    useParams,
} from "react-router-dom";


const useStyles = makeStyles((theme) => ({
    buttonVideo: {
        margin: theme.spacing(1),
        '&:hover': {
            color: "white",
            backgroundColor: "darked"
        }
    },

    buttonDiscussion: {
        margin: theme.spacing(1),
        '&:hover': {
            color: "white",
            // backgroundColor: "crimson"
        }
    },
}));

const ContentCard = ({ contentID, token, searchText }) => {
    const classes = useStyles();
    const [content, setContent] = useState();

    let { folderID } = useParams()

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

    const videoBtn = (type) => {
        if (type.includes("video"))
            return (
                <Button
                    variant="contained"
                    color="secondary"
                    className={classes.buttonVideo}
                    startIcon={<OndemandVideoRoundedIcon />}
                    href={`/dashboard/${folderID}/watch/${contentID}`}
                >
                    Watch Video
                </Button>
            )
        else
            return (
                <Button
                    variant="contained"
                    color="secondary"
                    className={classes.buttonVideo}
                    href={`http://localhost:8080/contents/${contentID}/download`}
                    startIcon={<GetAppRoundedIcon />}
                >
                    Download
                </Button>
            )
    }

    function highlightText(text) {
        if (text && searchText) {
            const regex = new RegExp(searchText, "gi")
            let newText = text.replace(regex, `<mark>$&</mark>`)
            return <span dangerouslySetInnerHTML={{ __html: newText }} />;
        }
        else
            return <span>{text}</span>
    }

    function tagText(text) {
        if (text) {
            const regex = new RegExp(/#[^,]+/, "gi")
            let newText = text.replace(regex, `<span class="tag">$&</span class="tag">`)
            return <span dangerouslySetInnerHTML={{ __html: newText }} />;
        }
        else
            return <span>{text}</span>
    }


    return (

        <>
            {content &&
                <Card className="card mb-2"
                >
                    <CardContent>
                        <h3 className="card-title text-center">{highlightText(content.title)}</h3>
                        <p className="card-text"><b>Uploaded At: </b>{content.date}</p>
                        <p className="card-text"><b>Uploaded By: </b>{content.author.firstName} {content.author.lastName}</p>
                        <p className="card-text"><b>Tags: </b>{searchText ? highlightText(content.tag) : tagText(content.tag)}</p>

                    </CardContent>
                    <CardActions style={{ justifyContent: "center" }}>
                        {videoBtn(content.file.mimetype)}
                        <Button
                            variant="contained"
                            color="primary"
                            className={classes.buttonDiscussion}
                            startIcon={<ForumRoundedIcon />}
                            href={`/discussion/content/${contentID}`}
                        >
                            Discussion
                        </Button>
                    </CardActions>
                </Card>
            }
        </>

    )
}

export default ContentCard
