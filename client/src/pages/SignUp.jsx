import { Link } from "react-router-dom"

function SignUp() {
  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl text-center font-semibold my-7">Sign Up</h1>
      <form className="flex flex-col items-center">
        <input
          type="text"
          placeholder="Username"
          className="border border-gray-300 rounded-md p-3 w-80 my-2"
          id="username"
        />
        <input
          type="email"
          placeholder="Email"
          className="border border-gray-300 rounded-md p-3 w-80 my-2"
          id="email"
        />
        <input
          type="password"
          placeholder="Password"
          className="border border-gray-300 rounded-md p-3 w-80 my-2"
          id="password"
        />
        <button
          type="submit"
          className="bg-slate-700 text-white w-80 p-3 rounded-md my-2 uppercase hover:bg-slate-800 
          disabled:opacity-50 
          cursor-pointer"
        >
          Sign Up
        </button>
      </form>
      <div>
        <p className="text-center mt-3">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-700 hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  )
}

export default SignUp
