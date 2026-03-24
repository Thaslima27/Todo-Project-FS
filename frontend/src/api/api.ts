const API_URL = "https://todo-project-fs-6.onrender.com"

// LOGIN (FORM DATA)
export async function login(email: string, password: string) {
  const response = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: new URLSearchParams({
      username: email,
      password: password
    })
  })
console.log("STATUS:",response.status)

const data = await response.json()
console.log("RESPOND DATA:" , data)

  return data
}

// SIGNUP
export async function signup(email: string, password: string) {
  const response = await fetch(`${API_URL}/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ email, password })
  })

  return response.json()
}

// GET TODOS
export async function getTodos() {
  const token = localStorage.getItem("token")

  const response = await fetch(`${API_URL}/todos`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })

  return response.json()
}

// CREATE TODO (FIXED)
export async function createTodo(title: string, due_date: string) {
  const token = localStorage.getItem("token")

  const response = await fetch(`${API_URL}/todos`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({
      title,
      due_date,   // ✅ correct field
      category_id: 1
    })
  })

  return response.json()
}

// DELETE
export async function deleteTodo(id: number) {
  const token = localStorage.getItem("token")

  await fetch(`${API_URL}/todos/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
}