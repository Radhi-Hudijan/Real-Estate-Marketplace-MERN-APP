import { GoogleAuthProvider, getAuth } from "@firebase/auth"
import { app } from "../firebase"
import { signInWithPopup } from "firebase/auth"
import { signInSuccess } from "../redux/user/userSlice"
import { useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"

function OAuth() {
  const dispatch = useDispatch() // get dispatch function from redux
  const navigate = useNavigate()
  // handle google sign in
  const handleGoogleSignIn = async () => {
    try {
      const provider = new GoogleAuthProvider()
      const auth = getAuth(app)

      const result = await signInWithPopup(auth, provider)
      const res = await fetch("/api/auth/google", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: result.user.displayName,
          email: result.user.email,
          photo_URL: result.user.photoURL,
        }), // send formData
      })

      const data = await res.json() // get JSON response
      dispatch(signInSuccess(data)) // set user in redux store

      navigate("/") // redirect to login page
    } catch (error) {
      console.log("Could not sign in with google", error)
    }
  }

  return (
    <button
      onClick={handleGoogleSignIn}
      type="button"
      className="bg-red-700 text-white p-3 rounded-lg uppercase hover:bg-red-800 w-80 my-2"
    >
      continue with google
    </button>
  )
}

export default OAuth
