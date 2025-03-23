/** @format */

import React from "react"
import { Outlet } from "react-router-dom"
import NavBarAdmin from "../NavBarAdmin"

const AdminLayout: React.FC = () => {
    return (
        <>
            <NavBarAdmin />
            <Outlet />
        </>
    )
}

export default AdminLayout
