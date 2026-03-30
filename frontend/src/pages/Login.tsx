import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { login } from "../api/api"
import { useAuthStore } from "../store/useAuthStore"

function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [message, setMessage] = useState("")
  const [isError, setIsError] = useState(false)

  const navigate = useNavigate()
  const setToken = useAuthStore((state) => state.setToken)


  async function handleLogin() {
    if (!email || !password) {
      setIsError(true)
      setMessage("Please enter email and password")
      return
    }

    try {
      const data = await login(email, password)

      if (data.access_token) {
        setToken(data.access_token)
        navigate("/dashboard")
      } else {
        setIsError(true)
        setMessage("Invalid email or password")
      }
    } catch {
      setIsError(true)
      setMessage("Server error")
    }
  }
return (
  <div className="login-wrapper">
    <div className="login-card">

      <h1 className="welcome">Login</h1>

      {message && (
        <p className={isError ? "error" : "success"}>
          {message}
        </p>
      )}

      <input
        className="glass-input"
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        className="glass-input"
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button className="login-btn" onClick={handleLogin}>
        Login
      </button>

      <div className="or">Or</div>

      <p className="signup-text">
        Don’t have an account?{" "}
        <span onClick={() => navigate("/signup")}>
          Sign Up
        </span>
      </p>

    </div>
  </div>
)
}
export default Login