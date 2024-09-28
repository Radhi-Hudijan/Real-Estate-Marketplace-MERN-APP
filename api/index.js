import express from "express"
import mongoose from "mongoose"
import dotenv from "dotenv"
import userRouter from "./routes/user.route.js"
import authRouter from "./routes/auth.route.js"
import cookieParser from "cookie-parser"

//Load env variables
dotenv.config()

//Create an express app
const app = express()

//Middleware
app.use(express.json())

//cookie parser to parse cookies from the incoming request headers
app.use(cookieParser())

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

//Routes
app.use("/api/user", userRouter)
app.use("/api/auth", authRouter)

//error handling middleware
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500
  const errorMessage = err.message || "Internal Server Error"
  return res.status(statusCode).json({
    success: false,
    status: statusCode,
    message: errorMessage,
  })
})

//connect to server
app.listen(process.env.PORT, () => {
  connect()
  console.log("Server is running on port 3000")
})
