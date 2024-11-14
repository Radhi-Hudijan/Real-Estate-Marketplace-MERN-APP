import React, { useEffect, useState } from "react"
import { Link } from "react-router-dom"

/* eslint-disable react/prop-types */
export default function Contact({ listing }) {
  const [landlord, setLandlord] = useState(null)
  const [message, setMessage] = useState("")

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(`/api/user/${listing.userRef}`)
        const data = await response.json()
        setLandlord(data)
      } catch (error) {
        console.error(error)
      }
    }

    fetchUser()
  }, [listing.userRef])

  // add the handelMessageChange function
  const handelMessageChange = (e) => {
    setMessage(e.target.value)
  }

  return (
    <>
      {landlord && (
        <div className="flex flex-col gap-2">
          <p>
            Contact <span className="font-semibold">{landlord.userName}</span>{" "}
            for
            <span className="font-semibold"> {listing.name.toLowerCase()}</span>
          </p>
          <textarea
            name="message"
            id="message"
            rows={2}
            value={message}
            onChange={handelMessageChange} // add the onChange event
            className="w-full p-2 border border-gray-300 rounded-lg"
            placeholder="Type your message here"
          ></textarea>
          <Link
            to={`mailto:${landlord.email}?subject=Regarding ${listing.name}&body=${message}`}
            className="bg-slate-700 text-white text-center py-2 rounded-lg hover:opacity-75"
          >
            Send Message
          </Link>
        </div>
      )}
    </>
  )
}
