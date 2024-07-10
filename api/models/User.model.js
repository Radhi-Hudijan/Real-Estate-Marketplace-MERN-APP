import { time } from "console"
import { Timestamp } from "mongodb"
import mongoose from "mongoose"
import { type } from "os"
const { Schema } = mongoose

const userSchema = new Schema(
  {
    name: {
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
  },
  { timestamps: true }
)

const User = mongoose.model("User", userSchema)

export default User
