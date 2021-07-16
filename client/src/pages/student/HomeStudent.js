import React from 'react'
import Tab from '../../components/Tab'
import Dashboard from '../../components/Dashboard'
import Container from '@material-ui/core/Container';


const HomeStudent = ({ selectedTab, type, search, watch, notification }) => {

    return (
        <div>
            <Tab selectedTab={selectedTab} type={type} search={search} watch={watch} notification={notification} />
        </div>
    )
}

export default HomeStudent
