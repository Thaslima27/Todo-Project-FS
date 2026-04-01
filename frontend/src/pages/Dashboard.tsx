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
  category_id?:number
}

export default function Dashboard() {
  const navigate = useNavigate()
  const location = useLocation()

  const [title, setTitle] = useState("")
  const [date, setDate] = useState("")
  const [category, setCategory] = useState(1)

  const [todos, setTodos] = useState<Todo[]>([])
  const [search, setSearch] = useState("")
  const [message, setMessage] = useState("")
  const [filter, setFilter] = useState("all") 

  const [priority, setPriority] = useState("low")
  const [priorityFilter, setPriorityFilter] = useState("all")

  const categoryMap: any = {
    1: "📁 General",
    2: "📘 Study",
    3: "🏠 Personal"
  }

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
      await createTodo(title, date, category, priority)
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

  // Complete toggle
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

          <select
            className="input"
            value={category}
            onChange={(e) => setCategory(Number(e.target.value))}
          >
            <option value={1}>General</option>
            <option value={2}>Study</option>
            <option value={3}>Personal</option>
          </select>

          <select
              className="input"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
            >
              <option value="low">🟢 Low</option>
              <option value="medium">🟡 Medium</option>
              <option value="high">🔴 High</option>
          </select>

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

        <div className="filters-container">

  {/* STATUS */}
  <div className="filter-group">
    <span className="filter-label">Status</span>
    <div className="filter-buttons">
      <button
        className={filter === "all" ? "active" : ""}
        onClick={() => setFilter("all")}
      >
        All
      </button>

      <button
        className={filter === "completed" ? "active" : ""}
        onClick={() => setFilter("completed")}
      >
        Completed
      </button>

      <button
        className={filter === "pending" ? "active" : ""}
        onClick={() => setFilter("pending")}
      >
        Pending
      </button>
    </div>
  </div>

  {/* PRIORITY */}
  <div className="filter-group">
    <span className="filter-label">Priority</span>
    <div className="filter-buttons">
      <button
        className={priorityFilter === "all" ? "active" : ""}
        onClick={() => setPriorityFilter("all")}
      >
        All
      </button>

      <button
        className={priorityFilter === "high" ? "active" : ""}
        onClick={() => setPriorityFilter("high")}
      >
        High
      </button>

      <button
        className={priorityFilter === "medium" ? "active" : ""}
        onClick={() => setPriorityFilter("medium")}
      >
        Medium
      </button>

      <button
        className={priorityFilter === "low" ? "active" : ""}
        onClick={() => setPriorityFilter("low")}
      >
        Low
      </button>
    </div>
  </div>

</div>
        {/* TODO LIST */}
        <div className="section">
          <h3>Your Todos</h3>

          <div className="todo-list">
            {todos.length === 0 ? (
              <div className="empty-state">
                No todos yet. Add your first task 🚀
              </div>

               ):(
                todos
                .filter((t) =>
                  t.title.toLowerCase().includes(search.toLowerCase())
                )
                .filter((t) => {
                  if (filter === "completed") return t.completed
                  if (filter === "pending") return !t.completed
                  return true
                })

                .filter((t: any) => {
                  if (priorityFilter === "all") return true
                  return t.priority === priorityFilter
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

                    <div className="todo-category">
                        {categoryMap[todo.category_id || 1]}
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