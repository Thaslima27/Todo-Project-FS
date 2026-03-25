import { useState, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { login } from "../api/api"

function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [message, setMessage] = useState("")
  const [isError, setIsError] = useState(false)

  const navigate = useNavigate()
  const location = useLocation()

  // ✅ Receive message from Signup
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
        localStorage.setItem("token", data.access_token)

        setIsError(false)
        setMessage("Login successful ✅")

        setTimeout(() => {
          navigate("/dashboard")
        }, 1000)

      } else {
        setIsError(true)
        setMessage(data.detail || "Login failed ❌")
      }

    } catch (error) {
      setIsError(true)
      setMessage("Server error ❌")
    }
  }

  return (
    <div>
      <h2>Login</h2>

      <p className={isError ? "error-msg" : "success-msg"}>
        {message}
      </p>

      <input
        type="email"
        placeholder="Enter email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <br /><br />

      <input
        type="password"
        placeholder="Enter password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <br /><br />

      <button onClick={handleLogin}>
        Login
      </button>
    </div>
  )
}

export default Login