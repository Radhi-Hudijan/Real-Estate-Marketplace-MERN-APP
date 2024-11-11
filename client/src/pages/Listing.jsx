import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react"

// Import Swiper styles
import "swiper/css"
import "swiper/css/navigation"

import { Navigation } from "swiper/modules"
import {
  FaBed,
  FaMapMarkedAlt,
  FaShare,
  FaBath,
  FaParking,
  FaChair,
} from "react-icons/fa"

export default function Listing() {
  // get the listing id using the useParams hook
  const { listingId } = useParams()

  const [listing, setListing] = useState(null)
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)
  console.log(listing)
  // fetch the listing data
  useEffect(() => {
    // fetch the listing data
    const fetchListing = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/listing/get/${listingId}`)
        const data = await response.json()
        if (data.success === false) {
          setLoading(false)
          setError(true)
          return
        }
        setLoading(false)
        setListing(data)
        setError(false)
      } catch (error) {
        setLoading(false)
        setError(true)
      }
    }

    fetchListing()
  }, [])

  return (
    <main>
      {loading && <p className=" text-center my-7  text-2xl">Loading ...</p>}
      {error && (
        <Link to="/">
          <div className=" flex-col items-center justify-items-center">
            <p className=" text-center my-7  text-2xl">Some Thing went wrong</p>
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              Go To Home Page
            </button>
          </div>
        </Link>
      )}
      {listing && !loading && !error && (
        <div>
          <Swiper
            modules={[Navigation]}
            navigation
            className="mySwiper"
            slidesPerView={1}
          >
            {listing.imageUrls.map((image, index) => (
              <SwiperSlide key={index}>
                <div
                  className=" h-[550px]"
                  style={{
                    backgroundImage: `url(${image})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                ></div>
              </SwiperSlide>
            ))}
          </Swiper>
          {/* // create the clipboard copy button */}
          <div className="fixed top-[13%] right-[3%] z-10 border rounded-full w-12 h-12 flex justify-center items-center bg-slate-100 cursor-pointer">
            <FaShare
              className=" text-slate-500"
              onClick={() => {
                navigator.clipboard.writeText(window.location.href)
                setCopied(true)
                setTimeout(() => {
                  setCopied(false)
                }, 2000)
              }}
            />
          </div>
          {copied && (
            <div className="fixed top-[19%] right-[5%] z-10 rounded-md bg-slate-100 p-2">
              <p className=" text-slate-500">Link Copied</p>
            </div>
          )}
          <div className="flex flex-col max-w-4xl mx-auto p-3 my-7 gap-4">
            <p className="text-2xl font-semibold">
              {listing.name} - ${" "}
              {listing.offer
                ? listing.discountedPrice.toLocaleString("en-US")
                : listing.regularPrice.toLocaleString("en-US")}
              {listing.type === "rent" && "/month"}
            </p>
            <p className=" flex items-center mt-6 gap-2 text-slate-600 text-sm">
              <FaMapMarkedAlt className="text-green-700" />
              {listing.address}
            </p>
            <div className="flex gap-4">
              <p className=" bg-red-900 w-full max-w-[200px] text-white text-center p-1 rounded-md ">
                {listing.type === "rent" ? "For Rent" : "For Sale"}
              </p>
              {listing.offer && (
                <p className=" bg-green-900 w-full max-w-[200px] text-white text-center p-1 rounded-md ">
                  {`${Math.round(
                    ((+listing.regularPrice - +listing.discountedPrice) /
                      +listing.regularPrice) *
                      100
                  )}% Off`}{" "}
                </p>
              )}
            </div>
            <p className="text-slate-800 text-justify">
              <span className="font-semibold text-black">Description - </span>{" "}
              {listing.description}
            </p>
            <ul className=" flex flex-wrap items-center text-green-900 font-semibold text-sm gap-4  sm:gap-6">
              <li className="flex items-center gap-1 whitespace-nowrap ">
                <FaBed className="text-lg text-green-700" />
                {listing.bedrooms > 1
                  ? `${listing.bedrooms} Beds`
                  : `${listing.bedrooms} Bed`}
              </li>
              <li className="flex items-center gap-1 whitespace-nowrap ">
                <FaBath className="text-lg text-green-700" />
                {listing.bathrooms > 1
                  ? `${listing.bathrooms} Baths`
                  : `${listing.bathrooms} Bath`}
              </li>
              <li className="flex items-center gap-1 whitespace-nowrap ">
                <FaParking className="text-lg text-green-700" />
                {listing.parking ? `Parking Available` : `No Parking`}
              </li>
              <li className="flex items-center gap-1 whitespace-nowrap ">
                <FaChair className="text-lg text-green-700" />
                {listing.furnished ? `Furnished` : `Unfurnished`}
              </li>
            </ul>
          </div>
        </div>
      )}
    </main>
  )
}
