import User from "../models/User.model.js"
import bcryptjs from "bcryptjs"

export const signup = async (req, res) => {
  const { userName, email, password } = req.body

  //hash password
  const salt = bcryptjs.genSaltSync(10)
  const hashedPassword = bcryptjs.hashSync(password, salt)

  const newUser = new User({ userName, email, password: hashedPassword })

  try {
    await newUser.save()
    res.status(201).json({ message: "User created successfully" })
  } catch (error) {
    res.status(400).json(error.message)
  }
}
