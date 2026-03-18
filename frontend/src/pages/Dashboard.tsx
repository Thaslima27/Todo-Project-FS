import { useEffect, useState } from "react"
import { getTodos, createTodo, deleteTodo } from "../api/api"

export default function Dashboard() {

  const [title, setTitle] = useState("")
  const [date, setDate] = useState("")
  const [todos, setTodos] = useState<any[]>([])
  const [search, setSearch] = useState("")

  // 🔹 LOAD TODOS
  async function loadTodos() {
    const data = await getTodos()

    if (data.detail) {
      alert("Session expired. Login again")
      localStorage.removeItem("token")
      window.location.href = "/login"
    } else {
      setTodos(data)
    }
  }

  useEffect(() => {
    loadTodos()
  }, [])

  // 🔹 ADD TODO
  async function addTodo() {
    if (!title || !date) {
      alert("Enter title and date")
      return
    }

    await createTodo(title, date)

    setTitle("")
    setDate("")

    loadTodos()
  }

  // 🔹 DELETE
  async function handleDelete(id: number) {
    await deleteTodo(id)
    loadTodos()
  }

  // 🔹 LOGOUT
  function handleLogout() {
    localStorage.removeItem("token")
    window.location.href = "/login"
  }

  return (
    <div className="container">

      <h1>Dashboard</h1>

      <button onClick={handleLogout}>Logout</button>

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

      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />

      <button onClick={addTodo}>Add Todo</button>

      <h2>Todo List</h2>

      {/* 📋 TODOS */}
      {todos
        .filter((t: any) =>
          t.title.toLowerCase().includes(search.toLowerCase())
        )
        .map((todo: any) => (
          <div key={todo.id} className="todo-card">
            <h3>{todo.title}</h3>
            <p>{todo.date}</p>

            <button onClick={() => handleDelete(todo.id)}>
              Delete
            </button>
          </div>
        ))}

    </div>
  )
}