/** @format */

import React from "react"
import { Outlet } from "react-router-dom"
import NavBar from "../NavBarAdmin"

const AdminLayout: React.FC = () => {
	return (
		<>
			<NavBar />
			<Outlet />
		</>
	)
}

export default AdminLayout
