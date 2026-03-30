import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { signup } from "../api/api"

function Signup() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [message, setMessage] = useState("")
  const [isError, setIsError] = useState(false)
  
  const navigate = useNavigate()

  async function handleSignup() {
    if (!email || !password || !confirmPassword) {
      setIsError(true)
      setMessage("Please fill all fields")
      return
    }

    if (password !== confirmPassword) {
      setIsError(true)
      setMessage("Passwords do not match")
      return
    }

    try {
      const data = await signup(email, password)

      if (data.id) {
        setIsError(false)
        setMessage("Signup successful ✅")

        setTimeout(() => {
          navigate("/login", {
            state: { message: "Signup successful! Please login" }
          })
        }, 1500)

      } else {
        setIsError(true)
        setMessage(data.detail || "Signup failed ❌")
      }

    } catch {
      setIsError(true)
      setMessage("Server error ❌")
    }
  }

return (
  <div className="login-wrapper">
    <div className="login-card">

      <h1 className="welcome">Sign Up</h1>

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

      <input
        className="glass-input"
        type="password"
        placeholder="Confirm Password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
      />

      <button className="login-btn" onClick={handleSignup}>
        Sign Up
      </button>

      <div className="or">Or</div>

      <p className="signup-text">
        Already have an account?{" "}
        <span onClick={() => navigate("/login")}>
          Login
        </span>
      </p>

    </div>
  </div>
)
}
export default Signup