import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage"
import { useRef, useState, useEffect } from "react"
import { useSelector } from "react-redux"
import { app } from "../firebase"

const Profile = () => {
  const { currentUser } = useSelector((state) => state.user) // get the current user from the store
  const fileRef = useRef() // create a reference to the file input element
  const [file, setFile] = useState(undefined) // create a state to store the selected file
  const [fileUploadProgress, setFileUploadProgress] = useState(0) // create a state to store the file upload progress
  const [fileUploadError, setFileUploadError] = useState(false) // create a state to store the file upload error
  const [formData, setFormData] = useState({}) // create a state to store the form data

  useEffect(() => {
    if (file) {
      handelFileUpload(file)
    }
  }, [file])

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

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold my-7 text-center">Profile</h1>
      <form className="flex flex-col gap-4">
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
          src={formData.avatar || currentUser.user.avatar}
          alt="profile avatar"
          className="w-24 h-24 rounded-full object-cover cursor-pointer self-center mt-2"
          onClick={() => fileRef.current.click()}
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
          id="username"
        />
        <input
          type="email"
          placeholder="email"
          className="border rounded-lg p-3"
          id="email"
        />
        <input
          type="password"
          placeholder="password"
          className="border rounded-lg p-3"
          id="password"
        />

        <button className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-90 disabled:opacity-80">
          Update
        </button>
      </form>
      <div className="flex justify-between mt-4 ">
        <span className="text-slate-700 cursor-pointer">Delete Account</span>
        <span className="text-red-500 ml-2 cursor-pointer">Sign Out</span>
      </div>
    </div>
  )
}

export default Profile
