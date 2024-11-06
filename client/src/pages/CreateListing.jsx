import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage"
import { useState } from "react"
import { app } from "../firebase"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"

function CreateListing() {
  const navigate = useNavigate()
  const { currentUser } = useSelector((state) => state.user) // get the current user from the store
  const [files, setFile] = useState([]) // state to store the images uploaded
  const [formData, setFormData] = useState({
    imageUrls: [],
    name: "radhi",
    description: "",
    address: "",
    type: "rent",
    bedrooms: 1,
    bathrooms: 1,
    regularPrice: 50,
    discountedPrice: 0,
    parking: false,
    furnished: false,
    offer: false,
  }) // state to store the form data

  console.log(formData)
  const [imageUploadError, setImageUploadError] = useState(false) // state to store the image upload error
  const [uploading, setUploading] = useState(false) // state to store the upload progress
  const [error, setError] = useState(false) // state to store the error message
  const [loading, setLoading] = useState(false) // state to store the loading state

  const handelImageSubmit = () => {
    if (files.length > 0 && files.length + formData.imageUrls.length < 7) {
      setImageUploadError(false)
      setUploading(true)
      const promises = []

      for (let i = 0; i < files.length; i++) {
        promises.push(storeImage(files[i]))
      }

      Promise.all(promises)
        .then((urls) => {
          setFormData({
            ...formData,
            imageUrls: formData.imageUrls.concat(urls), // add the uploaded image URLs to the form data and keep the previous ones
          })
          setImageUploadError(false)
          setUploading(false)
        })
        .catch((error) => {
          setImageUploadError("An error occurred while uploading the images")
          console.log(error)
          setUploading(false)
        })
    } else {
      setImageUploadError("You can only upload up to 6 images")
      setUploading(false)
    }
  }

  const storeImage = async (file) => {
    return new Promise((resolve, reject) => {
      // create a reference to the storage service
      const storage = getStorage(app)
      const fileName = new Date().getTime() + "-" + file.name
      const storageRef = ref(storage, fileName)
      const uploadTask = uploadBytesResumable(storageRef, file)
      // listen to the state change of the upload task
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          console.log("Upload is " + progress + "% done")
        },
        (error) => {
          reject(error)
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL)
          })
        }
      )
    })
  }

  //handle image deletion
  const handleDeleteImage = (e) => {
    const index = formData.imageUrls.findIndex(
      (url) => url === e.target.previousElementSibling.src
    )
    const newImages = formData.imageUrls
    newImages.splice(index, 1)
    setFormData({
      ...formData,
      imageUrls: newImages,
    })
  }

  // Handle form change
  const handleInputChange = (e) => {
    // check if the input is sell or rent
    if (e.target.id === "sell" || e.target.id === "rent") {
      setFormData({ ...formData, type: e.target.id }) // set the type to the value of the checkbox
    }

    // check if the checkbox is checked
    if (
      e.target.id === "parking" ||
      e.target.id === "furnished" ||
      e.target.id === "offer"
    ) {
      setFormData({ ...formData, [e.target.id]: e.target.checked }) // set the value of the checkbox to the form data
    }

    // check if the input is bedrooms, bathrooms, regularPrice, or discountedPrice
    if (
      e.target.type === "number" ||
      e.target.type === "text" ||
      e.target.type === "textarea"
    ) {
      setFormData({ ...formData, [e.target.id]: e.target.value }) // set the value of the input to the form data
    }
  }

  // handle form submission
  const handleFormSubmit = async (e) => {
    e.preventDefault()
    try {
      // check if there are no images uploaded
      if (formData.imageUrls.length === 0) {
        setError("Please upload at least one image")
        return
      }

      // check if the regular price is greater than the discounted price
      if (+formData.regularPrice < +formData.discountedPrice) {
        setError(
          "The discounted price cannot be greater than the regular price"
        )
        return
      }

      setLoading(true)
      setError(false)
      const response = await fetch("/api/listing/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...formData, userRef: currentUser._id }),
      })

      const data = await response.json()

      // check if the response is successful
      if (data.success === false) {
        setLoading(false)
        setError(data.message)
        return
      }

      setLoading(false)
      setError(null)
      alert("Listing created successfully")
      navigate(`/listing/${data._id}`)
    } catch (error) {
      setLoading(false)
      setError(error.message)
    }
  }

  return (
    <main className="p-3 max-w-4xl mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">
        Create a Listing
      </h1>
      <form
        onSubmit={handleFormSubmit}
        className="flex flex-col sm:flex-row gap-4"
      >
        <div className=" flex flex-col gap-4 flex-1">
          <input
            type="text"
            placeholder="Name"
            className="border p-3 rounded-lg"
            id="name"
            maxLength="62"
            minLength="10"
            required
            onChange={handleInputChange}
          />

          <textarea
            type="text"
            placeholder="Description"
            className="border p-3 rounded-lg"
            id="description"
            required
            onChange={handleInputChange}
          />

          <input
            type="text"
            placeholder="Address"
            className="border p-3 rounded-lg"
            id="address"
            required
            onChange={handleInputChange}
          />
          <div className="flex flex-wrap gap-3">
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="sell"
                className="w-5"
                onChange={handleInputChange}
                checked={formData.type === "sell"} // check if the type is sell
              />
              <span>Sell</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="rent"
                className="w-5"
                onChange={handleInputChange}
                checked={formData.type === "rent"} // check if the type is rent
              />
              <span>Rent</span>
            </div>

            <div className="flex gap-2">
              <input
                type="checkbox"
                id="parking"
                className="w-5"
                onChange={handleInputChange}
                checked={formData.parking} // check if the parking is true
              />
              <span>Parking Spot</span>
            </div>

            <div className="flex gap-2">
              <input
                type="checkbox"
                id="furnished"
                className="w-5"
                onChange={handleInputChange}
                checked={formData.furnished} // check if the furnished is true
              />
              <span>Furnished</span>
            </div>

            <div className="flex gap-2">
              <input
                type="checkbox"
                id="offer"
                className="w-5"
                onChange={handleInputChange}
                checked={formData.offer} // check if the offer is true
              />
              <span>Offer</span>
            </div>
          </div>

          <div className="flex gap-6 flex-wrap">
            <div className="flex gap-2 items-center">
              <input
                type="number"
                id="bedrooms"
                min={1}
                max={10}
                required
                className=" p-3 rounded-lg border-gray-300"
                onChange={handleInputChange}
                value={formData.bedrooms}
              />
              <span>Beds</span>
            </div>

            <div className="flex gap-2 items-center">
              <input
                type="number"
                id="bathrooms"
                min={1}
                max={10}
                required
                className=" p-3 rounded-lg border-gray-300"
                onChange={handleInputChange}
                value={formData.bathrooms}
              />
              <span>Baths</span>
            </div>

            <div className="flex gap-2 items-center">
              <input
                type="number"
                id="regularPrice"
                required
                className=" p-3 rounded-lg border-gray-300"
                min={50}
                max={10000000}
                onChange={handleInputChange}
                value={formData.regularPrice}
              />
              <div className="flex flex-col items-center">
                <span>Regular Price</span>
                {formData.type === "sell" ? (
                  "$"
                ) : (
                  <span className="text-xs">($ /month)</span>
                )}
              </div>
            </div>

            {formData.offer && (
              <div className="flex gap-2 items-center">
                <input
                  type="number"
                  id="discountedPrice"
                  min={0}
                  max={10000000}
                  required
                  className=" p-3 rounded-lg border-gray-300"
                  onChange={handleInputChange}
                  value={formData.discountedPrice}
                />
                <div className="flex flex-col items-center">
                  <span>Discounted Price</span>
                  {formData.type === "sell" ? (
                    "$"
                  ) : (
                    <span className="text-xs">($ /month)</span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-col gap-4 flex-1">
          <p className="font-semibold">
            Images:
            <span className="font-normal text-gray-600 ml-2">
              The first image will be the cover (max 6)
            </span>
          </p>
          <div className=" flex gap-4">
            <input
              type="file"
              id="images"
              accept="image/*"
              multiple
              className="p-3 border border-gray-300 rounded w-full"
              onChange={(e) => setFile(e.target.files)}
            />
            <button
              type="button"
              onClick={handelImageSubmit}
              className="p-3 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80"
              disabled={uploading}
            >
              {uploading ? "Uploading..." : "Upload"}
            </button>
          </div>
          {imageUploadError && (
            <p className="text-red-500 text-sm">{imageUploadError}</p>
          )}
          {formData.imageUrls.length > 0 &&
            formData.imageUrls.map((url, index) => (
              <div
                key={index}
                className="flex gap-6 justify-between border p-3 rounded-lg items-center bg-gray-100"
              >
                <img
                  src={url}
                  alt="listing img"
                  className="w-20 h-20 object-contain rounded-lg "
                />
                <button
                  type="button"
                  className="border border-red-500 rounded-lg p-2 h-10 text-red-500 hover:bg-red-500 hover:text-white uppercase"
                  onClick={handleDeleteImage}
                >
                  Delete
                </button>
              </div>
            ))}
          <button
            disabled={loading || uploading}
            className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-90 disabled:opacity-70"
          >
            {loading ? "Creating..." : "Create Listing"}
          </button>
          {error && (
            <span className="text-red-500 text-center mt-3">{error}</span>
          )}
        </div>
      </form>
    </main>
  )
}

export default CreateListing
