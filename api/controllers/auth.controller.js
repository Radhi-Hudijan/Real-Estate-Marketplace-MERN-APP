import User from "../models/User.model.js"
import bcryptjs from "bcryptjs"
import createError from "../utils/error.js"
import jwt from "jsonwebtoken"

export const signup = async (req, res, next) => {
  const { userName, email, password } = req.body

  //hash password
  const salt = bcryptjs.genSaltSync(10)
  const hashedPassword = bcryptjs.hashSync(password, salt)

  const newUser = new User({ userName, email, password: hashedPassword })

  try {
    await newUser.save()
    res.status(201).json({ message: "User created successfully" })
  } catch (error) {
    next(error)
  }
}

export const singin = async (req, res, next) => {
  const { email, password } = req.body

  try {
    const validUser = await User.findOne({ email })
    if (!validUser) {
      return next(createError(404, "User not found"))
    }
    const validPassword = bcryptjs.compareSync(password, validUser.password)
    if (!validPassword) {
      return next(createError(401, "Wrong credentials"))
    }

    //generate token and send it to the client
    const token = jwt.sign({ userId: validUser._id }, process.env.JWT_SECRET)

    const { password: hashedPassword, ...userWithoutPassword } = validUser._doc
    res
      .cookie("access_token", token, {
        //send token as cookie
        httpOnly: true, //cookie cannot be accessed by client side scripts
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 1 day
      })
      .status(200)
      .json({ user: userWithoutPassword })
  } catch (error) {
    next(error)
  }
}
