import { useState } from "react"
import { forgotPassword } from "../api/api"
import { useNavigate } from "react-router-dom"

function ForgotPassword() {
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")
  const navigate = useNavigate()

  async function handleForgot() {
    const data = await forgotPassword(email)

    if (data.reset_token) {
      setMessage("Reset token generated")

      // 👇 Send token to reset page
      setTimeout(() => {
        navigate("/reset-password", {
          state: { token: data.reset_token }
        })
      }, 1000)

    } else {
      setMessage(data.detail || "Error")
    }
  }

  return (
    <div className="login-wrapper">
      <div className="login-card">
        <h1 className="welcome">Forgot Password</h1>

        <input
          className="glass-input"
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <button className="login-btn" onClick={handleForgot}>
          Generate Reset Link
        </button>

        {message && <p className="success">{message}</p>}
      </div>
    </div>
  )
}

export default ForgotPassword