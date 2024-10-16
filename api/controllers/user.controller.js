import User from "../models/User.model.js"
import bcryptjs from "bcryptjs"
import createError from "../utils/error.js"

//get user
export const getUser = (req, res) => {
  res.send("Hello World from user controller")
}

//update user
export const updateUser = async (req, res, next) => {
  //verify user is updating their own account
  if (req.user.userId !== req.params.id) {
    return next(createError(403, "You can only update your account"))
  }

  try {
    if (req.body.password) {
      //hash the new password
      const salt = bcryptjs.genSaltSync(10)
      req.body.password = bcryptjs.hashSync(req.body.password, salt)
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          //update user details if they are provided
          userName: req.body.userName,
          email: req.body.email,
          password: req.body.password,
          avatar: req.body.avatar,
        },
      },
      { new: true } //return updated user
    )

    const { password, ...userWithoutPassword } = updatedUser._doc

    res.status(200).json(userWithoutPassword)
  } catch (error) {
    next(error)
  }

  return next()
}

// delete user
export const deleteUser = async (req, res, next) => {
  //verify user is updating their own account
  if (req.user.userId !== req.params.id) {
    return next(createError(403, "You can only delete your account"))
  }

  try {
    await User.findByIdAndDelete(req.params.id)
    res.clearCookie("access_token")
    res.status(200).json("User has been deleted")
  } catch (error) {
    next(error)
  }
}
