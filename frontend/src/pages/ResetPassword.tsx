import { useState } from "react"
import { resetPassword } from "../api/api"
import { useNavigate, useLocation } from "react-router-dom"

function ResetPassword() {
  const location = useLocation()
  const navigate = useNavigate()

  // 👇 Get token from forgot page
  const [token] = useState(location.state?.token || "")
  const [password, setPassword] = useState("")
  const [message, setMessage] = useState("")

  async function handleReset() {
    const data = await resetPassword(token, password)

    if (data.message) {
      setMessage("Password reset successful")
      setTimeout(() => navigate("/login"), 1500)
    } else {
      setMessage(data.detail || "Error")
    }
  }

  return (
    <div className="login-wrapper">
      <div className="login-card">
        <h1 className="welcome">Reset Password</h1>

         {/* TOKEN FIELD */}
        <input
          className="glass-input"
          type="text"
          value={token}
          readOnly
        />

        <input
          className="glass-input"
          type="password"
          placeholder="New password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="login-btn" onClick={handleReset}>
          Reset Password
        </button>

        {message && <p className="success">{message}</p>}
      </div>
    </div>
  )
}

export default ResetPassword