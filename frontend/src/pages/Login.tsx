import { useState, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { login } from "../api/api"
import { useAuthStore } from "../store/useAuthStore"

function Login(){

  const [email,setEmail] = useState<string>("")
  const [password,setPassword] = useState<string>("")
  const [message, setMessage] = useState("")
  const [isError, setIsError] = useState(false)

  const navigate = useNavigate()
  const location = useLocation()

  // ✅ Zustand
  const setToken = useAuthStore((state) => state.setToken)

  // ✅ AUTO REDIRECT IF ALREADY LOGGED IN
  useEffect(() => {
    const token = useAuthStore.getState().token

    if (token) {
      navigate("/dashboard")
    }

    // ✅ SHOW MESSAGE FROM SIGNUP
    if (location.state?.message) {
      setMessage(location.state.message)
      setIsError(false)

      setTimeout(() => {
        setMessage("")
        navigate(location.pathname, { replace: true }) // clear state
      }, 2000)
    }

  }, [location.state])

  async function handleLogin(){
    try{
      const data = await login(email,password)

      if(data.access_token){
        setToken(data.access_token)   // ✅ Zustand used here

        setIsError(false)
        setMessage("Login successful ✅")

        setTimeout(() => {
          navigate("/dashboard", {
            state: { message: "Login successful ✅" }
          })
        }, 1000)

      } else {
        setIsError(true)
        setMessage(data.detail || "Login failed ❌")
      }

    }catch(error){
      console.error(error)
      setIsError(true)
      setMessage("Server error ❌")
    }
  }

  return(
    <div className="container">
      <h2>Login</h2>

      <p className={isError ? "error-msg" : "success-msg"}>
        {message}
      </p>

      <input
        type="email"
        placeholder="Enter email"
        value={email}
        onChange={(e)=>setEmail(e.target.value)}
      />

      <br/><br/>

      <input
        type="password"
        placeholder="Enter password"
        value={password}
        onChange={(e)=>setPassword(e.target.value)}
      />

      <br/><br/>

      <button onClick={handleLogin}>
        Login
      </button>
    </div>
  )
}

export default Login