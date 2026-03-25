import './App.css'
import {Routes,Route,Link,Navigate} from "react-router-dom"


import Signup from "./pages/Signup"
import Login from "./pages/Login"
import Dashboard from "./pages/Dashboard"
import PrivateRoute from "./PrivateRoute"

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

 {/* 🔐 PRIVATE ROUTE */}
        <Route 
          path="/dashboard" 
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          } 
        />

      </Routes>

    </div>
  )
}

export default App