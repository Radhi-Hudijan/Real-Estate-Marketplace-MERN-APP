import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage"
import { useRef, useState, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { app } from "../firebase"
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
} from "../redux/user/userSlice"

const Profile = () => {
  const { currentUser, loading, error } = useSelector((state) => state.user) // get the current user from the store
  const fileRef = useRef(null) // create a reference to the file input element
  const [file, setFile] = useState(undefined) // create a state to store the selected file
  const [fileUploadProgress, setFileUploadProgress] = useState(0) // create a state to store the file upload progress
  const [fileUploadError, setFileUploadError] = useState(false) // create a state to store the file upload error
  const [formData, setFormData] = useState({}) // create a state to store the form data
  const [updateSuccess, setUpdateSuccess] = useState(false) // create a state to store the update success message
  const dispatch = useDispatch() // get the dispatch function from redux

  // update the form data when the current user changes
  useEffect(() => {
    if (file) {
      handelFileUpload(file)
    }
  }, [file])

  // handle fi§le upload
  const handelFileUpload = (file) => {
    const storage = getStorage(app)
    const fileName = new Date().getTime() + "-" + file.name // create a unique file name
    const storageRef = ref(storage, fileName)
    const uploadTask = uploadBytesResumable(storageRef, file) // create an upload task

    // listen to the state change of the upload task
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        setFileUploadProgress(Math.round(progress))
      },
      // handle the error
      (error) => {
        setFileUploadError(true)
        console.log(error)
      },
      // handle the success and get the download URL for the uploaded file
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setFormData({ ...formData, avatar: downloadURL })
        })
      }
    )
  }

  // handle input change
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value })
  }

  // handle form submission to update user profile
  const handleUpdate = async (e) => {
    e.preventDefault()
    try {
      dispatch(updateUserStart()) // set loading state
      const response = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()
      if (data.success === false) {
        dispatch(updateUserFailure(data.message))
        return
      }

      dispatch(updateUserSuccess(data))
      setUpdateSuccess(true)
    } catch (error) {
      dispatch(updateUserFailure(error.message))
    }
  }

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold my-7 text-center">Profile</h1>
      <form className="flex flex-col gap-4" onSubmit={handleUpdate}>
        <input
          type="file"
          ref={fileRef}
          hidden
          accept="image/*"
          onChange={(e) => {
            setFile(e.target.files[0])
          }}
        />
        <img
          src={formData?.avatar || currentUser?.avatar}
          alt="profile avatar"
          className="w-24 h-24 rounded-full object-cover cursor-pointer self-center mt-2"
          onClick={() => {
            fileRef.current.click()
          }}
        />

        <p className="text-center">
          {fileUploadError ? (
            <span className="text-red-500 ">File upload error</span>
          ) : fileUploadProgress > 0 && fileUploadProgress < 100 ? (
            <span className="text-green-500 ">
              File uploading... at {fileUploadProgress}%{" "}
            </span>
          ) : fileUploadProgress === 100 ? (
            <span className="text-green-500 ">File uploaded successfully</span>
          ) : (
            ""
          )}
        </p>

        <input
          type="text"
          placeholder="username"
          className="border rounded-lg p-3"
          id="userName"
          defaultValue={currentUser.userName}
          onChange={handleInputChange}
        />
        <input
          type="email"
          placeholder="email"
          className="border rounded-lg p-3"
          id="email"
          defaultValue={currentUser.email}
          onChange={handleInputChange}
        />
        <input
          type="password"
          placeholder="password"
          className="border rounded-lg p-3"
          id="password"
          onChange={handleInputChange}
        />

        <button
          className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-90 disabled:opacity-80"
          disabled={loading}
        >
          {loading ? "Loading..." : "Update"}
        </button>
      </form>

      <div className="flex justify-between mt-4 ">
        <span className="text-slate-700 cursor-pointer">Delete Account</span>
        <span className="text-red-500 ml-2 cursor-pointer">Sign Out</span>
      </div>
      {error && <p className="text-red-500 text-center mt-3">{error}</p>}
      {updateSuccess && (
        <p className="text-green-500 text-center mt-3">
          Profile successfully updated
        </p>
      )}
    </div>
  )
}

export default Profile
