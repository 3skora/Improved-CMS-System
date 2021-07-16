import React from 'react'
import Tab from '../../components/Tab'

import { BrowserRouter as Router, Route } from 'react-router-dom'
import { Link } from 'react-router-dom';

const HomeStaff = ({ selectedTab, type, search, watch, notification }) => {
    return (

        <div>
            <Tab selectedTab={selectedTab} type={type} search={search} watch={watch} notification={notification} />
        </div>

        // <div className="container">
        //     <Link className="btn btn-outline-primary btn-lg m-2" role="button" to="/courses">upload content</Link>
        // </div>


    )
}

export default HomeStaff
