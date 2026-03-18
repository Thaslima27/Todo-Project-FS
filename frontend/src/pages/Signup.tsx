import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { signup } from "../api/api"

function Signup(){

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const navigate = useNavigate()

  async function handleSignup(){

    try{

      const data = await signup(email, password)

      console.log(data)

      if(data.id){
        alert("Signup successful! Please login")
        navigate("/login")   // ✅ redirect to login
      }else{
        alert(data.detail || "Signup failed")
      }

    }catch(error){
      console.error(error)
      alert("Error during signup")
    }

  }

  return(
    <div className="container">
        <h2>Signup</h2>

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

      <button onClick={handleSignup}>
        Signup
      </button>

    </div>

  )

}

export default Signup

