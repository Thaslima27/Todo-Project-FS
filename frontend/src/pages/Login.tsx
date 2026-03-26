import { useState, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { login } from "../api/api"
import { useAuthStore } from "../store/useAuthStore"

function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [message, setMessage] = useState("")
  const [isError, setIsError] = useState(false)

  const navigate = useNavigate()
  const location = useLocation()
  
  const setToken = useAuthStore((state) => state.setToken)

  useEffect(() => {
    if (location.state?.message) {
      setMessage(location.state.message)
      setIsError(false)
    }
  }, [location])

  async function handleLogin() {
    try {
      const data = await login(email, password)

      if (data.access_token) {
        setToken(data.access_token)
        navigate("/dashboard")
      } else {
        setIsError(true)
        setMessage(data.detail || "Login failed ❌")
      }

    } catch {
      setIsError(true)
      setMessage("Server error ❌")
    }
  }

  return (
    <div className="container">
      <h2>Login</h2>

      {message && (
        <p className={isError ? "error-msg" : "success-msg"}>
          {message}
        </p>
      )}

      <input
        type="email"
        placeholder="Enter email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Enter password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button onClick={handleLogin}>Login</button>

      {/* 🔥 Signup Link */}
      <p>
        Don't have an account?{" "}
        <span
          onClick={() => navigate("/signup")}
          className="link"
        >
          Signup
        </span>
      </p>
    </div>
  )
}

export default Login