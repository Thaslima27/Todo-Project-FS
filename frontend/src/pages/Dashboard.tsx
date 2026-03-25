import { useEffect, useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { getTodos, createTodo, deleteTodo } from "../api/api"
import { useAuthStore } from "../store/useAuthStore"

export default function Dashboard() {

  const navigate = useNavigate()
  const location = useLocation()

  const [title, setTitle] = useState("")
  const [date, setDate] = useState("")
  const [todos, setTodos] = useState<any[]>([])
  const [search, setSearch] = useState("")
  const [message, setMessage] = useState("")

  // Zustand logout
  const logout = useAuthStore((state) => state.logout)

  // Load todos
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

  // Initial load
  useEffect(() => {
    loadTodos()

    if (location.state?.message) {
      setMessage(location.state.message)

      setTimeout(() => {
        setMessage("")
        navigate(0)
      }, 2000)
    }

  }, [location, navigate])

  // Add todo
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

  // Delete todo
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

  // Logout
  function handleLogout() {
    logout()
    navigate("/login", { replace: true })
  }

  return (
    <div>

      <h2>Dashboard</h2>

      <button className="logout-btn" onClick={handleLogout}>
        Logout
      </button>

      {/* Message */}
      {message && (
        <p className={message.includes("❌") ? "error-msg" : "success-msg"}>
          {message}
        </p>
      )}

      {/* Search */}
      <label>Search Todos</label>
      <input
        className="search-box"
        type="text"
        placeholder="Search todos..."
        title="Search Todos"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <h3>Create Todo</h3>

      <label>Todo Title</label>
      <input
        className="input-box"
        type="text"
        placeholder="Enter todo title"
        title="Todo Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <label>Select Date</label>
      <input
        className="input-box"
        type="date"
        title="Select Date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />

      <button className="add-btn" onClick={addTodo}>
        Add Todo
      </button>

      <h3>Todo List</h3>

      {todos
        .filter((t: any) =>
          t.title.toLowerCase().includes(search.toLowerCase())
        )
        .map((todo: any) => (
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
  )
}