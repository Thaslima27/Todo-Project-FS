import './App.css'
import {Routes,Route,Link,Navigate} from "react-router-dom"

import Signup from "./pages/Signup"
import Login from "./pages/Login"
import Dashboard from "./pages/Dashboard"

function App(){

return(

<div>

<h1>Todo App</h1>

<nav>

<Link to="/signup">Signup</Link> |
<Link to="/login">Login</Link> |
<Link to="/dashboard">Dashboard</Link>

</nav>

<Routes>

<Route path="/" element={<Navigate to="/login" />} /> {/* redirect to login */}
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />

</Routes>

</div>

)

}

export default App