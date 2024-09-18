import { Link, useNavigate } from "react-router-dom"
import { useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import {
  signInStart,
  signInSuccess,
  signInFailure,
} from "../redux/user/userSlice"

function Signin() {
  const [formData, setFormData] = useState({}) // store user input
  const { error, loading } = useSelector((state) => state.user) // get error and loading state from redux
  const navigate = useNavigate()

  const dispatch = useDispatch() // get dispatch function from redux

  // handle user input
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value }) // update formData
  }

  // handle form submission
  const onSubmit = async (e) => {
    e.preventDefault() // prevent page refresh
    try {
      dispatch(signInStart()) // set loading state

      // send POST request to server
      const response = await fetch("/api/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData), // send formData
      })

      const data = await response.json() // get JSON response

      // handle response
      if (data.success === false) {
        dispatch(signInFailure(data.message)) // set error message
        return
      }
      dispatch(signInSuccess(data)) // set user in redux store
      navigate("/") // redirect to login page
    } catch (error) {
      dispatch(signInFailure(error.message)) // set error message
    }
  }

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl text-center font-semibold my-7">Sign In</h1>
      <form className="flex flex-col items-center" onSubmit={onSubmit}>
        <input
          type="email"
          placeholder="Email"
          className="border border-gray-300 rounded-md p-3 w-80 my-2"
          id="email"
          onChange={handleChange}
        />
        <input
          type="password"
          placeholder="Password"
          className="border border-gray-300 rounded-md p-3 w-80 my-2"
          id="password"
          onChange={handleChange}
        />
        <button
          disabled={loading} // disable button when loading
          type="submit"
          className="bg-slate-700 text-white w-80 p-3 rounded-md my-2 uppercase hover:bg-slate-800 
          disabled:opacity-50 
          cursor-pointer"
        >
          {loading ? "LOADING..." : "Sign In"}
        </button>
      </form>
      {error && <p className="text-red-500 text-center mt-3">{error}</p>}

      <div>
        <p className="text-center mt-3">
          Do not have an account?{" "}
          <Link to="/signup" className="text-blue-700 hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Signin
