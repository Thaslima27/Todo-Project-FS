import './App.css'
import { Routes, Route, Navigate } from "react-router-dom"

import Signup from "./pages/Signup"
import Login from "./pages/Login"
import Dashboard from "./pages/Dashboard"
import PrivateRoute from "./PrivateRoute"

function App() {
  return (
    <div className="container">
      <h1>Todo App</h1>

      <Routes>
        {/* Default open Signup */}
        <Route path="/" element={<Navigate to="/signup" />} />

        {/* Step 1 */}
        <Route path="/signup" element={<Signup />} />

        {/* Step 2 */}
        <Route path="/login" element={<Login />} />

        {/* Step 3 - Protected */}
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