import { useAuthStore } from "../store/useAuthStore"

const API_URL = "https://todo-project-fs-6.onrender.com"

// 🔐 LOGIN
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

  if (!response.ok) {
    throw new Error("Login failed")
  }

  return response.json()
}

// 📝 SIGNUP
export async function signup(name: string, email: string, password: string) {
  const response = await fetch(`${API_URL}/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ name, email, password })
  })

  if (!response.ok) {
    throw new Error("Signup failed")
  }

  return response.json()
}

// 🔁 FORGOT PASSWORD
export async function forgotPassword(email: string) {
  const response = await fetch(`${API_URL}/forgot-password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ email })
  })

  if (!response.ok) {
    throw new Error("Forgot password failed")
  }

  return response.json()
}

// 🔁 RESET PASSWORD
export async function resetPassword(token: string, new_password: string) {
  const response = await fetch(`${API_URL}/reset-password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ token, new_password })
  })

  if (!response.ok) {
    throw new Error("Reset password failed")
  }

  return response.json()
}

// 📥 GET TODOS
export async function getTodos() {
  const token = useAuthStore.getState().token   // ✅ Zustand

  const response = await fetch(`${API_URL}/todos`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })

  return response.json()
}

// ➕ CREATE TODO
export async function createTodo(title: string, due_date: string, category_id: number) {
  const token = useAuthStore.getState().token   // ✅ Zustand

  const response = await fetch(`${API_URL}/todos`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({
      title,
      due_date,
      category_id
    })
  })

  return response.json()
}

export async function updateTodo(id: number, completed: boolean) {
  const token = useAuthStore.getState().token

  const response = await fetch(`${API_URL}/todos/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",   // ✅ IMPORTANT
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({
      completed: completed   // ✅ send in body
    })
  })

  if (!response.ok) {
    throw new Error("Failed to update todo")
  }

  return response.json()
}

// ❌ DELETE TODO
export async function deleteTodo(id: number) {
  const token = useAuthStore.getState().token   // ✅ Zustand

  await fetch(`${API_URL}/todos/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
}