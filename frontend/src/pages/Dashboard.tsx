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

  // ✅ Zustand logout
  const logout = useAuthStore((state) => state.logout)

  // 🔹 LOAD TODOS
  async function loadTodos() {
    try {
      const data = await getTodos()

      if (data.detail) {
        setMessage("Session expired. Login again ❌")

        logout()   // ✅ Zustand instead of localStorage
        navigate("/login", { replace: true })

      } else {
        setTodos(data)
      }

    } catch (error) {
      console.error(error)
      setMessage("Error loading todos ❌")
    }
  }

  // 🔹 INITIAL LOAD + MESSAGE
  useEffect(() => {
    loadTodos()

    // ✅ show login success message
    if (location.state?.message) {
      setMessage(location.state.message)

      setTimeout(() => {
        setMessage("")
        navigate(location.pathname, { replace: true })
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
    logout()   // ✅ Zustand handles token removal
    navigate("/login", { replace: true })
  }

  return (
    <div className="container">

      <h1>Dashboard</h1>

      <button onClick={handleLogout}>Logout</button>

      {/* ✅ MESSAGE */}
      {message && <p className="success-msg">{message}</p>}

      {/* 🔍 SEARCH */}
      <input
        placeholder="Search todos..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <h2>Create Todo</h2>

      <input
        placeholder="Todo title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <label>
        Select Date:
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </label>

      <button onClick={addTodo}>Add Todo</button>

      <h2>Todo List</h2>

      {todos
        .filter((t: any) =>
          t.title.toLowerCase().includes(search.toLowerCase())
        )
        .map((todo: any) => (
          <div key={todo.id} className="todo-card">
            <h3>{todo.title}</h3>
            <p>{todo.due_date || todo.date}</p>

            <button onClick={() => handleDelete(todo.id)}>
              Delete
            </button>
          </div>
        ))}

    </div>
  )
}