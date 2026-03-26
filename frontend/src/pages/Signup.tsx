import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { signup } from "../api/api"

function Signup() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [message, setMessage] = useState("")
  const [isError, setIsError] = useState(false)

  const navigate = useNavigate()

  async function handleSignup() {
    try {
      const data = await signup(email, password)

      if (data.id) {
        setIsError(false)
        setMessage("Signup successful ✅")

        setTimeout(() => {
          navigate("/login", {
            state: { message: "Signup successful! Please login" }
          })
        }, 1000)

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
    <div className="container">
      <h2>Signup</h2>

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

      <button onClick={handleSignup}>Signup</button>

      {/* 🔥 Login Link */}
      <p>
        Already have an account?{" "}
        <span
          onClick={() => navigate("/login")}
          className="link"
        >
          Login
        </span>
      </p>
    </div>
  )
}

export default Signup