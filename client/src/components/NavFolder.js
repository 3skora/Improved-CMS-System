import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { useHistory } from 'react-router-dom';



const useStyles = makeStyles((theme) => ({
    root: {
        '& > * + *': {
            marginTop: theme.spacing(2),
        },
    },
}));

function handleClick(event) {
    event.preventDefault();
    console.info('You clicked a breadcrumb.');
}

export default function CustomSeparator({ navs, setNewNavs }) {
    const classes = useStyles();
    let history = useHistory()


    return (
        <div className={classes.root}>
            <Breadcrumbs
                className='mx-1'
                separator={<NavigateNextIcon fontSize="small" />}
                aria-label="breadcrumb">
                <Link color="inherit"
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                        history.push(`/`);
                    }} >
                    Home
                </Link>
                {
                    navs.map((element, index) => {
                        if (index !== navs.length - 1) {
                            return (
                                <Link color="inherit"
                                    style={{ cursor: "pointer" }}
                                    onClick={() => {
                                        history.push(`${element._id}`);
                                        // setNewNavs()
                                    }} >
                                    {element.folderName}
                                </Link>
                            )
                        }
                        else
                            return (
                                <Typography color="textPrimary">{element.folderName}</Typography>
                            )
                    })
                }
            </Breadcrumbs>
        </div>
    );
}
