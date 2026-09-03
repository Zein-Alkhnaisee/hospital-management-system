import React from 'react'
import NavBar from '../NavBar/NavBar'
import { Outlet } from 'react-router-dom'
import FooterHome from '../Footer/FooterHome'

const MainLayout = () => {
    return (
        <>
            <NavBar/>
            <Outlet/>
            <FooterHome/>
        </>
    )
}

export default MainLayout