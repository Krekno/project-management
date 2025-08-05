import React, { useState, useEffect } from "react"
import axios from "axios"
import "bootstrap/dist/css/bootstrap.min.css"

function App({ url }) {
	const [tasks, setTasks] = useState([])
	const [input, setInput] = useState("")
	const [filter, setFilter] = useState("all")

	const api = axios.create({
		baseURL: url,
		headers: {
			Authorization: `Bearer ${localStorage.getItem("token")}`
		}
	})

	const logout = () => {
		localStorage.removeItem("token")
		window.location.reload()
	}

	useEffect(() => {
		api.get("/tasks")
			.then((res) => setTasks(res.data))
			.catch((err) => console.error("Error fetching tasks:", err))
	}, [url])

	const addTask = () => {
		if (input.trim() === "") return
		api.post("/tasks", { title: input })
			.then((res) => {
				setTasks([...tasks, res.data])
				setInput("")
			})
			.catch((err) => console.error("Error adding task:", err))
	}

	const toggleTask = (id) => {
		api.patch(`${url}/tasks/${id}/toggle`)
			.then(() => {
				setTasks(tasks.map((t) => (t.id === id ? { ...t, isCompleted: !t.isCompleted } : t)))
			})
			.catch((err) => console.error("Error toggling task:", err))
	}

	const deleteTask = (id) => {
		api.delete(`/tasks/${id}`)
			.then(() => {
				setTasks(tasks.filter((task) => task.id !== id))
			})
			.catch((err) => console.error("Error deleting task:", err))
	}

	console.log("Tasks:", tasks)
	let filteredTasks = []
	if (tasks.length > 0) {
		filteredTasks = tasks.filter((task) => {
			if (filter === "completed") return task.isCompleted
			if (filter === "active") return !task.isCompleted
			if (filter === "all") return true
			return true
		})
	}
	console.log("Filtered tasks:", filteredTasks)

	return (
		<div className="container py-5">
			<div className="d-flex justify-content-between align-items-center mb-4">
				<h2 className="text-center mb-4">📝 To-Do Dashboard</h2>

				<div className="d-flex justify-content-end mb-2">
					<button className="btn btn-outline-danger btn-sm" onClick={logout}>
						Logout
					</button>
				</div>
			</div>

			<div className="input-group mb-3">
				<input
					type="text"
					className="form-control"
					placeholder="Enter a new task..."
					value={input}
					onChange={(e) => setInput(e.target.value)}
					onKeyPress={(e) => e.key === "Enter" && addTask()}
				/>
				<button className="btn btn-primary" onClick={addTask}>
					Add
				</button>
			</div>

			<div className="d-flex justify-content-center mb-4">
				<div className="btn-group">
					<button className={`btn btn-outline-secondary ${filter === "all" ? "active" : ""}`} onClick={() => setFilter("all")}>
						All
					</button>
					<button className={`btn btn-outline-secondary ${filter === "active" ? "active" : ""}`} onClick={() => setFilter("active")}>
						Active
					</button>
					<button className={`btn btn-outline-secondary ${filter === "completed" ? "active" : ""}`} onClick={() => setFilter("completed")}>
						Completed
					</button>
				</div>
			</div>

			{filteredTasks.length === 0 ? (
				<p className="text-center text-muted">No tasks yet, champ 💤</p>
			) : (
				<ul className="list-group">
					{filteredTasks.map((task) => (
						<li
							key={task.id}
							className={`list-group-item d-flex justify-content-between align-items-center ${
								task.isCompleted ? "list-group-item-success" : ""
							}`}>
							<span
								style={{
									textDecoration: task.isCompleted ? "line-through" : "none"
								}}>
								{task.title}
							</span>

							<div className="btn-group">
								{/* Toggle complete button */}
								<button
									className={`btn btn-sm ${task.isCompleted ? "btn-secondary" : "btn-success"}`}
									onClick={() => toggleTask(task.id)}
									aria-label={task.isCompleted ? "Mark as not done" : "Mark as done"}
									title={task.isCompleted ? "Mark as not done" : "Mark as done"}>
									{task.isCompleted ? "✅" : "❌"}
								</button>

								{/* Delete button */}
								<button
									className="btn btn-sm btn-danger"
									onClick={() => deleteTask(task.id)}
									aria-label="Delete task"
									title="Delete task">
									delete
								</button>
							</div>
						</li>
					))}
				</ul>
			)}
		</div>
	)
}

export default App
