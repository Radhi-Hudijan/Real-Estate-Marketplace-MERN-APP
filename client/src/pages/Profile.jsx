import React from "react"
import { useSelector } from "react-redux"

const Profile = () => {
  const { currentUser } = useSelector((state) => state.user)
  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold my-7 text-center">Profile</h1>
      <form className="flex flex-col gap-4">
        <img
          src={currentUser.user.avatar}
          alt="profile avatar"
          className="w-24 h-24 rounded-full object-cover cursor-pointer self-center mt-2"
        />
        <input
          type="text"
          placeholder="username"
          className="border rounded-lg p-3"
          id="username"
          value={currentUser.user.userName}
        />
        <input
          type="email"
          placeholder="email"
          className="border rounded-lg p-3"
          id="email"
          value={currentUser.user.userName}
        />
        <input
          type="password"
          placeholder="password"
          className="border rounded-lg p-3"
          id="password"
          value={currentUser.user.userName}
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
