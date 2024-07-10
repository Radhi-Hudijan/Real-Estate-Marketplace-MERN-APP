import express from "express"
import mongoose from "mongoose"
import dotenv from "dotenv"

//Load env variables
dotenv.config()

//Create an express app
const app = express()

//connect to MongoDB
const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGODB)
    console.log("MongoDB is connected")
  } catch (error) {
    console.log(error)
  }
}

mongoose.connection.on("disconnected", () => {
  console.log("mongoDB disconnected")
})

//connect to server
app.listen(process.env.PORT, () => {
  connect()
  console.log("Server is running on port 3000")
})