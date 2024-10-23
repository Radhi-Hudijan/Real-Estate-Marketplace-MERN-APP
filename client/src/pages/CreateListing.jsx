import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage"
import { useState } from "react"
import { app } from "../firebase"
import { set } from "mongoose"

function CreateListing() {
  const [files, setFile] = useState([]) // state to store the images uploaded
  const [formData, setFormData] = useState({
    imageUrls: [],
  }) // state to store the form data
  const [imageUploadError, setImageUploadError] = useState(false) // state to store the image upload error
  const [uploading, setUploading] = useState(false) // state to store the upload progress

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

  return (
    <main className="p-3 max-w-4xl mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">
        Create a Listing
      </h1>
      <form className="flex flex-col sm:flex-row gap-4">
        <div className=" flex flex-col gap-4 flex-1">
          <input
            type="text"
            placeholder="Name"
            className="border p-3 rounded-lg"
            id="name"
            maxLength="62"
            minLength="10"
            required
          />

          <textarea
            type="text"
            placeholder="Description"
            className="border p-3 rounded-lg"
            id="description"
            required
          />

          <input
            type="text"
            placeholder="Address"
            className="border p-3 rounded-lg"
            id="address"
            required
          />
          <div className="flex flex-wrap gap-3">
            <div className="flex gap-2">
              <input type="checkbox" id="sell" className="w-5" />
              <span>Sell</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id="rent" className="w-5" />
              <span>Rent</span>
            </div>

            <div className="flex gap-2">
              <input type="checkbox" id="parking" className="w-5" />
              <span>Parking Spot</span>
            </div>

            <div className="flex gap-2">
              <input type="checkbox" id="furnished" className="w-5" />
              <span>Furnished</span>
            </div>

            <div className="flex gap-2">
              <input type="checkbox" id="offer" className="w-5" />
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
              />
              <span>Baths</span>
            </div>

            <div className="flex gap-2 items-center">
              <input
                type="number"
                id="regularPrice"
                required
                className=" p-3 rounded-lg border-gray-300"
                min={1}
                max={10}
              />
              <div className="flex flex-col items-center">
                <span>Regular Price</span>
                <span className="text-xs">($ /month)</span>
              </div>
            </div>

            <div className="flex gap-2 items-center">
              <input
                type="number"
                id="discountedPrice"
                min={1}
                max={10}
                required
                className=" p-3 rounded-lg border-gray-300"
              />
              <div className="flex flex-col items-center">
                <span>Discounted Price</span>
                <span className="text-xs">($ /month)</span>
              </div>
            </div>
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
          <button className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-90 disabled:opacity-80">
            Create Listing
          </button>
        </div>
      </form>
    </main>
  )
}

export default CreateListing
