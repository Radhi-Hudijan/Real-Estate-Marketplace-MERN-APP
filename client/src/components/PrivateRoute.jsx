import { useSelector } from "react-redux"
import { Navigate, Outlet } from "react-router-dom"

const PrivateRoute = () => {
  const { currentUser } = useSelector((state) => state.user) // get the current user from the store
  return currentUser ? <Outlet /> : <Navigate to="/signin" /> // if the user is logged in, show the Outlet, otherwise redirect to the signin page
}

export default PrivateRoute
