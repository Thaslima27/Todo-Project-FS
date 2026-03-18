import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { login } from "../api/api"

function Login(){

const [email,setEmail] = useState<string>("")
const [password,setPassword] = useState<string>("")

const navigate = useNavigate()

async function handleLogin(){

try{

const data = await login(email,password)

console.log(data)

if(data.access_token){
  localStorage.setItem("token", data.access_token)
  navigate("/dashboard")
} else {
  alert(data.detail || "Login failed")
}

}catch(error){

console.error(error)

alert("Error during login")

}

}

return(

<div className="container">
<h2>Login</h2>


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