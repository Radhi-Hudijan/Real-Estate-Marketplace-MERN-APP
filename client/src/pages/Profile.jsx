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
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure,
  signOutFailure,
  signOutSuccess,
  signOutStart,
} from "../redux/user/userSlice"

import { Link } from "react-router-dom"

const Profile = () => {
  const { currentUser, loading, error } = useSelector((state) => state.user) // get the current user from the store
  const fileRef = useRef(null) // create a reference to the file input element
  const [file, setFile] = useState(undefined) // create a state to store the selected file
  const [fileUploadProgress, setFileUploadProgress] = useState(0) // create a state to store the file upload progress
  const [fileUploadError, setFileUploadError] = useState(false) // create a state to store the file upload error
  const [formData, setFormData] = useState({}) // create a state to store the form data
  const [updateSuccess, setUpdateSuccess] = useState(false) // create a state to store the update success message
  const dispatch = useDispatch() // get the dispatch function from redux
  const [listings, setListings] = useState([])
  const [showListing, setShowListing] = useState(false)
  const [showListingError, setShowListingError] = useState(false)

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

  // handle user delete
  const handelUserDelete = async () => {
    try {
      dispatch(deleteUserStart()) // set loading state
      const response = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: "DELETE",
      })
      const data = await response.json()
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message))
        return
      }

      dispatch(deleteUserSuccess(data))
    } catch (error) {
      dispatch(deleteUserFailure(error.message))
    }
  }

  // handle sign out
  const handelSignOut = async () => {
    try {
      dispatch(signOutStart()) // set loading state
      const response = await fetch(`/api/auth/signout`)
      const data = await response.json()
      if (data.success === false) {
        dispatch(signOutFailure(data.message))
        return
      }

      dispatch(signOutSuccess(data))
    } catch (error) {
      dispatch(signOutFailure(error.message))
    }
  }

  // handle show listing
  const handleShowListing = async () => {
    setShowListing(!showListing)
    try {
      setShowListingError(false)
      const response = await fetch(`/api/user/listings/${currentUser._id}`)
      const data = await response.json()
      if (data.success === false) {
        setShowListingError(true)
        return
      }
      setListings(data)
    } catch (error) {
      setShowListingError(true)
    }
  }

  // handle delete listing
  const handleDeleteListing = async (listingId) => {
    try {
      const response = await fetch(`/api/listing/delete/${listingId}`, {
        method: "DELETE",
      })
      const data = await response.json()
      if (data.success === false) {
        console.log(data.message)
        return
      }
      setListings(listings.filter((listing) => listing._id !== listingId))
    } catch (error) {
      console.log(error.message)
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

        <Link
          to={"/create-listing"}
          className="bg-green-600 text-white text-center p-3 uppercase rounded-lg hover:opacity-90 disabled:opacity-80"
        >
          Create Listing
        </Link>
      </form>
      <div className="flex justify-between mt-4 ">
        <span
          className="text-slate-700 cursor-pointer"
          onClick={handelUserDelete}
        >
          Delete Account
        </span>
        <span
          className="text-red-500 ml-2 cursor-pointer"
          onClick={handelSignOut}
        >
          Sign Out
        </span>
      </div>
      {error && <p className="text-red-500 text-center mt-3">{error}</p>}
      {updateSuccess && (
        <p className="text-green-500 text-center mt-3">
          Profile successfully updated
        </p>
      )}
      <button
        onClick={handleShowListing}
        className="text-green-600 w-full mt-3"
      >
        Show Your Listings
      </button>

      {showListingError && listings > 0 && (
        <p className="text-red-500 text-center mt-3">Error fetching listings</p>
      )}

      {showListing && (
        <div>
          <h1 className="text-3xl font-semibold my-7 text-center">
            Your Listings
          </h1>
          <div className="mt-3">
            {listings.map((listing) => (
              <div
                key={listing._id}
                className="border p-3 rounded-lg mt-2 flex justify-between items-center"
              >
                <Link to={`/listing/${listing._id}`}>
                  <img
                    src={listing.imageUrls[0]}
                    alt={listing.name}
                    className="w-16 h-16 object-contain"
                  />
                </Link>
                <Link to={`/listing/${listing._id}`}>
                  <div className="flex flex-col flex-1">
                    <span className="text-lg text-slate-700 font-semibold hover:underline truncate">
                      {listing.name}
                    </span>
                    <span className="text-sm">{listing.description}</span>
                  </div>
                </Link>
                <div className="flex flex-col ">
                  <button
                    onClick={() => handleDeleteListing(listing._id)}
                    className="text-red-500 text-center uppercase hover:underline"
                  >
                    Delete
                  </button>
                  <Link to={`/update-listing/${listing._id}`}>
                    <button className="text-green-500 text-center uppercase hover:underline">
                      Edit
                    </button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default Profile
