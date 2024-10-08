import mongoose from "mongoose"
const { Schema } = mongoose

const userSchema = new Schema(
  {
    userName: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
      default: "https://i.postimg.cc/zDHHXfd8/no-profile-picture-15257.png",
    },
  },
  { timestamps: true }
)

const User = mongoose.model("User", userSchema)

export default User
