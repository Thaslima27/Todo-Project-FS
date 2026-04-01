import { useEffect, useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { getTodos, createTodo, deleteTodo, updateTodo } from "../api/api"
import { useAuthStore } from "../store/useAuthStore"

type Todo = {
  id: number
  title: string
  due_date?: string
  date?: string
  completed?: boolean
}

export default function Dashboard() {
  const navigate = useNavigate()
  const location = useLocation()

  const [title, setTitle] = useState("")
  const [date, setDate] = useState("")
  const [todos, setTodos] = useState<Todo[]>([])
  const [search, setSearch] = useState("")
  const [message, setMessage] = useState("")
  const [filter, setFilter] = useState("all") 

  const logout = useAuthStore((state) => state.logout)

  // LOAD TODOS
  async function loadTodos() {
    try {
      const data = await getTodos()

      if (data.detail) {
        setMessage("Session expired. Login again")

        setTimeout(() => {
          logout()
          navigate("/login", { replace: true })
        }, 1500)
      } else {
        setTodos(data)
      }
    } catch (error) {
      console.error(error)
      setMessage("Error loading todos")
    }
  }

  useEffect(() => {
    loadTodos()

    if (location.state?.message) {
      setMessage(location.state.message)
      setTimeout(() => setMessage(""), 2000)
    }
  }, [location.state])

  // ADD TODO
  async function addTodo() {
    if (!title || !date) {
      setMessage("Enter title and date")
      return
    }

    try {
      await createTodo(title, date)
      setMessage("Todo added successfully")

      setTitle("")
      setDate("")

      loadTodos()
      setTimeout(() => setMessage(""), 2000)
    } catch (error) {
      console.error(error)
      setMessage("Error adding todo")
    }
  }

  // DELETE TODO
  async function handleDelete(id: number) {
    try {
      await deleteTodo(id)
      setMessage("Todo deleted successfully")

      loadTodos()
      setTimeout(() => setMessage(""), 2000)
    } catch (error) {
      console.error(error)
      setMessage("Error deleting todo")
    }
  }

  // ✅ NEW
  async function toggleComplete(id: number, current: boolean) {
    await updateTodo(id, !current)
    loadTodos()
  }

  // LOGOUT
  function handleLogout() {
    logout()
    navigate("/login", { replace: true })
  }

  return (
    <div className="dashboard-wrapper">

      <div className="dashboard-card">

        {/* ✅ NAVBAR */}
        <div className="navbar">
          <h1>
          <div className="logo">TaskFlow</div>
          </h1>
          <div className="nav-right">
            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>

        {/* MESSAGE */}
        {message && (
          <p className={message.includes("Error") ? "error" : "success"}>
            {message}
          </p>
        )}

        {/* CREATE TODO */}
        <div className="section">
          <h3>Create Todo</h3>

          <input
            className="input"
            type="text"
            placeholder="Enter todo title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <input
            className="input"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />

          <button className="add-btn" onClick={addTodo}>
            Add Todo
          </button>
        </div>

        {/* SEARCH */}
        <div className="section">
          <h3>Search</h3>

          <input
            className="input"
            type="text"
            placeholder="Search todos..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* ✅ FILTER */}
        <div className="filter-buttons">
          <button onClick={() => setFilter("all")}>All</button>
          <button onClick={() => setFilter("completed")}>Completed</button>
          <button onClick={() => setFilter("pending")}>Pending</button>
        </div>

        {/* TODO LIST */}
        <div className="section">
          <h3>Your Todos</h3>

          <div className="todo-list">
            {todos.length === 0 ? (
              <div className="empty-state">
                No todos yet. Add your first task 🚀
              </div>
            ) : (
              todos
                .filter((t) =>
                  t.title.toLowerCase().includes(search.toLowerCase())
               )
                .filter((t) => {
                  if (filter === "completed") return t.completed
                  if (filter === "pending") return !t.completed
                  return true
                })
                .map((todo) => (
                  <div key={todo.id} className="todo-item">

                    <div>
                      <input
                        type="checkbox"
                        checked={todo.completed || false}
                        onChange={() =>
                          toggleComplete(todo.id, todo.completed || false)
                        }
                      />

                      <div className={`todo-title ${todo.completed ? "done" : ""}`}>
                        {todo.title}
                      </div>

                      <div className="todo-date">
                        {todo.due_date || todo.date}
                      </div>
                    </div>

                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(todo.id)}
                    >
                      Delete
                    </button>

                  </div>
                ))
            )}
          </div>
        </div>

      </div>
    </div>
  )
}