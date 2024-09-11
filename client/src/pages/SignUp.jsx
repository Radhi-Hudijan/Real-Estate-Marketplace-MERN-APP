import { Link, useNavigate } from "react-router-dom"
import { useState } from "react"

function SignUp() {
  const [formData, setFormData] = useState({}) // store user input
  const [error, setError] = useState(null) // store error message
  const [loading, setLoading] = useState(false) // store loading state
  const navigate = useNavigate()
  // handle user input
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value }) // update formData
  }

  // handle form submission
  const onSubmit = async (e) => {
    e.preventDefault() // prevent page refresh
    try {
      setLoading(true) // set loading state

      // send POST request to server
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData), // send formData
      })

      const data = await response.json() // get JSON response

      // handle response
      if (data.success === false) {
        setLoading(false) // set loading state
        setError(data.message) // set error message
        return
      }
      setLoading(false) // set loading
      setError(null) // clear error message
      alert("User created successfully") // show success message
      navigate("/signin") // redirect to login page
    } catch (error) {
      setLoading(false) // set loading state
      setError(error.message) // set error message
    }
  }

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl text-center font-semibold my-7">Sign Up</h1>
      <form className="flex flex-col items-center" onSubmit={onSubmit}>
        <input
          type="text"
          placeholder="Username"
          className="border border-gray-300 rounded-md p-3 w-80 my-2"
          id="userName"
          onChange={handleChange}
        />
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
          {loading ? "LOADING..." : "Sign Up"}
        </button>
      </form>
      {error && <p className="text-red-500 text-center mt-3">{error}</p>}

      <div>
        <p className="text-center mt-3">
          Already have an account?{" "}
          <Link to="/signin" className="text-blue-700 hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  )
}

export default SignUp
