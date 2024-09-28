import createError from "./error.js"
import jwt from "jsonwebtoken"

export const verifyUser = (req, res, next) => {
  const token = req.cookies.access_token
  if (!token) {
    return next(createError(401, "you are not authorized"))
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return next(createError(401, "you are not authorized"))
    }
    req.user = user
    next()
  })
}
