import { Navigate } from "react-router-dom"
import { useAuthStore } from "./store/useAuthStore"

function PrivateRoute({ children } : { children : any}) {
  const token = useAuthStore((state) => state.token)

  return token ? children : <Navigate to="/login" />
}

export default PrivateRoute