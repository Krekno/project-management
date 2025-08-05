import axios from "axios"
import React, { useState } from "react"
import { useNavigate } from "react-router-dom"

const AuthPage = ({ url, setIsLoggedIn }) => {
	const [isLogin, setIsLogin] = useState(true)
	const [formData, setFormData] = useState({ email: "", password: "", name: "" })
	const navigate = useNavigate()

	const toggleForm = () => {
		setIsLogin(!isLogin)
		setFormData({ email: "", password: "", name: "" })
	}

	const handleChange = (e) => {
		setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
	}

	const handleSubmit = async (e) => {
		e.preventDefault()
		if (isLogin) {
			console.log("Logging in:", { email: formData.email, password: formData.password })
			const response = await axios.post(`${url}/auth/login`, { email: formData.email, password: formData.password })
			if (response.data.token) {
				localStorage.setItem("token", response.data.token)
				setIsLoggedIn(true)
				navigate("/dashboard")
			} else {
				alert("Login failed. Please check your credentials.")
			}
		} else {
			console.log("Registering:", { email: formData.email, password: formData.password, username: formData.username })
			const response = await axios.post(`${url}/auth/register`, {
				email: formData.email,
				password: formData.password,
				username: formData.username
			})
			if (response.data.token) {
				localStorage.setItem("token", response.data.token)
				setIsLogin(true)
			} else {
				alert("Registration failed. Please try again.")
			}
		}
	}

	return (
		<div className="container mt-5 d-flex justify-content-center">
			<div className="card shadow p-4" style={{ width: "100%", maxWidth: "400px" }}>
				<h3 className="text-center mb-4">{isLogin ? "Login" : "Register"}</h3>
				<form onSubmit={handleSubmit}>
					{!isLogin && (
						<div className="mb-3">
							<label htmlFor="username" className="form-label">
								Username
							</label>
							<input type="text" className="form-control" name="username" value={formData.username} onChange={handleChange} required />
						</div>
					)}
					<div className="mb-3">
						<label htmlFor="email" className="form-label">
							Email address
						</label>
						<input type="email" className="form-control" name="email" value={formData.email} onChange={handleChange} required />
					</div>
					<div className="mb-3">
						<label htmlFor="password" className="form-label">
							Password
						</label>
						<input type="password" className="form-control" name="password" value={formData.password} onChange={handleChange} required />
					</div>
					<button type="submit" className="btn btn-primary w-100">
						{isLogin ? "Login" : "Register"}
					</button>
				</form>
				<p className="text-center mt-3">
					{isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
					<button className="btn btn-link p-0" onClick={toggleForm}>
						{isLogin ? "Register" : "Login"}
					</button>
				</p>
			</div>
		</div>
	)
}

export default AuthPage
