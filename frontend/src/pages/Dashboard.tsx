import { useEffect, useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { getTodos, createTodo, deleteTodo } from "../api/api"
import { useAuthStore } from "../store/useAuthStore"

// ✅ Type (TSX correct)
type Todo = {
  id: number
  title: string
  due_date?: string
  date?: string
}

export default function Dashboard() {

  const navigate = useNavigate()
  const location = useLocation()

  const [title, setTitle] = useState("")
  const [date, setDate] = useState("")
  const [todos, setTodos] = useState<Todo[]>([])   // ✅ fixed type
  const [search, setSearch] = useState("")
  const [message, setMessage] = useState("")

  const logout = useAuthStore((state) => state.logout)

  // 🔹 LOAD TODOS
  async function loadTodos() {
    try {
      const data = await getTodos()

      if (data.detail) {
        setMessage("Session expired. Login again ❌")

        setTimeout(() => {
          logout()
          navigate("/login", { replace: true })
        }, 1500)

      } else {
        setTodos(data)
      }

    } catch (error) {
      console.error(error)
      setMessage("Error loading todos ❌")
    }
  }

  // 🔹 INITIAL LOAD
  useEffect(() => {
    loadTodos()

    if (location.state?.message) {
      setMessage(location.state.message)

      setTimeout(() => {
        setMessage("")
      }, 2000)
    }

  }, [location.state])

  // 🔹 ADD TODO
  async function addTodo() {
    if (!title || !date) {
      setMessage("Enter title and date ⚠️")
      return
    }

    try {
      await createTodo(title, date)

      setMessage("Todo added successfully ✅")

      setTitle("")
      setDate("")

      loadTodos()

      setTimeout(() => setMessage(""), 2000)

    } catch (error) {
      console.error(error)
      setMessage("Error adding todo ❌")
    }
  }

  // 🔹 DELETE TODO
  async function handleDelete(id: number) {
    try {
      await deleteTodo(id)

      setMessage("Todo deleted successfully ✅")

      loadTodos()

      setTimeout(() => setMessage(""), 2000)

    } catch (error) {
      console.error(error)
      setMessage("Error deleting todo ❌")
    }
  }

  // 🔹 LOGOUT
  function handleLogout() {
    logout()
    navigate("/login", { replace: true })
  }

  return (
    <div className="dashboard-container">

      <h2>Dashboard</h2>

      <button className="logout-btn" onClick={handleLogout}>
        Logout
      </button>

      {/* MESSAGE */}
      {message && (
        <p className={message.includes("❌") ? "error-msg" : "success-msg"}>
          {message}
        </p>
      )}

      {/* 🔍 SEARCH */}
      <div className="section-box">
        <h3>Search</h3>

        <label htmlFor="search">Search Todos</label>
        <input
          id="search"
          className="search-box"
          type="text"
          placeholder="Search todos..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* ➕ CREATE */}
      <div className="section-box">
        <h3>Create Todo</h3>

        <label htmlFor="title">Todo Title</label>
        <input
          id="title"
          className="input-box"
          type="text"
          placeholder="Enter todo title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <label htmlFor="date">Select Date</label>
        <input
          id="date"
          className="input-box"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />

        <button className="add-btn" onClick={addTodo}>
          Add Todo
        </button>
      </div>

      {/* 📋 LIST */}
      <div className="section-box">
        <h3>Todo List</h3>

        <div className="todo-list">
          {todos
            .filter((t) =>
              t.title.toLowerCase().includes(search.toLowerCase())
            )
            .map((todo) => (
              <div key={todo.id} className="todo-card">
                <h4>{todo.title}</h4>
                <p>{todo.due_date || todo.date}</p>

                <button
                  className="delete-btn"
                  onClick={() => handleDelete(todo.id)}
                >
                  Delete
                </button>
              </div>
            ))}
        </div>
      </div>

    </div>
  )
}