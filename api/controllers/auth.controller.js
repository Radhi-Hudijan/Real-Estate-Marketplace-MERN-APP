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
      return next(createError(404, "Email or password are not correct"))
    }
    const validPassword = bcryptjs.compareSync(password, validUser.password)
    if (!validPassword) {
      return next(createError(401, "Email or password are not correct"))
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
      .json(userWithoutPassword)
  } catch (error) {
    next(error)
  }
}

export const googleOAuth = async (req, res, next) => {
  try {
    const { name, email, photo_URL } = req.body
    const user = await User.findOne({ email })

    if (!user) {
      //if user does not exist, create a new user
      const generatedPassword = Math.random().toString(36).slice(-8) //generate random password

      const hashedPassword = bcryptjs.hashSync(generatedPassword, 10) //hash password

      const newUser = new User({
        userName:
          name.split(" ").join("").toLowerCase() +
          Math.random().toString(36).slice(-4), // make username unique and add random string
        password: hashedPassword,
        email,
        avatar: photo_URL,
      })
      await newUser.save()

      const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET) //generate token
      const { password: pass, ...rest } = newUser._doc
      res
        .cookie("access_token", token, {
          httpOnly: true,
        })
        .status(200)
        .json(rest)
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET)
    const { password: hashedPassword, ...userWithoutPassword } = user._doc
    res
      .cookie("access_token", token, {
        httpOnly: true,
      })
      .status(200)
      .json(userWithoutPassword)
  } catch (error) {
    next(error)
  }
}

// signout
export const signout = (req, res) => {
  try {
    res.clearCookie("access_token") //clear cookie
    res.status(200).json({ message: "Signout successfully" })
  } catch (error) {
    next(error)
  }
}
