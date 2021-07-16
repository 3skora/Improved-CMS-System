import React, { useState, useEffect } from "react";
import axios from "axios";
import Folder from './Folder'
import Content from './Content';
import FolderIcon from '@material-ui/icons/Folder';

import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { makeStyles } from '@material-ui/core/styles';
import { Accordion, AccordionDetails, AccordionSummary, Typography } from '@material-ui/core/';
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
    rootAccordion: {
        width: '100%',
        // marginBottom : "15px"
    },
    heading: {
        fontSize: theme.typography.pxToRem(15),
        flexBasis: '33.33%',
        flexShrink: 0,
    },
    secondaryHeading: {
        fontSize: theme.typography.pxToRem(15),
        color: theme.palette.text.secondary,
    },

    root: {
        flexGrow: 1,
    },

}));

const SearchResult = () => {
    const classes = useStyles();
    const [searchResult, setSearchResult] = useState();

    let history = useHistory()

    let searchText = useParams().q
    const token = localStorage.getItem('token')
    const userID = localStorage.getItem('userID')
    const role = localStorage.getItem('role')

    const auth = {
        headers: { token }
    }

    useEffect(() => {
        axios.get(`http://localhost:8080/search/?q=${searchText}`, auth)
            .then(res => {
                console.log(res.data)
                setSearchResult(res.data)
            })
            .catch(err => console.log(err.response.data))

    }, [searchText])

    return (
        <div>
            {
                searchResult &&
                <div className={classes.rootAccordion}>
                    <Accordion defaultExpanded={true}>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <Typography className={classes.heading}>Search Result ({searchResult.length})</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <div className="container">
                                <div className="row">
                                    {
                                        searchResult.map(content => {
                                            return <Content
                                                className="col"
                                                key={content._id}
                                                contentID={content._id}
                                                token={token}
                                                searchText={searchText}
                                            />
                                        })
                                    }
                                </div>
                            </div>

                        </AccordionDetails>
                    </Accordion>
                </div>
            }
        </div>
    )
}

export default SearchResult
