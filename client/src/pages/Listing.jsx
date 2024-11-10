import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react"

// Import Swiper styles
import "swiper/css"
import "swiper/css/navigation"

import { Navigation } from "swiper/modules"

export default function Listing() {
  // get the listing id using the useParams hook
  const { listingId } = useParams()

  const [listing, setListing] = useState(null)
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(false)
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
        <div className="w-full">
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
        </div>
      )}
    </main>
  )
}
