import React from "react"
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { useState } from "react"
import AuthPage from "./pages/AuthPage"
import Dashboard from "./pages/Dashboard"

const App = () => {
	const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"))
	const url = "http://localhost:8080"

	return (
		<Router>
			<Routes>
				<Route path="/" element={<AuthPage url={url} setIsLoggedIn={setIsLoggedIn} />} />
				<Route path="/dashboard" element={isLoggedIn ? <Dashboard url={url} /> : <Navigate to="/" />} />
				<Route path="*" element={<div className="text-center mt-5">404 Not Found 😵</div>} />
			</Routes>
		</Router>
	)
}

export default App
