import createError from "./error.js"
import jwt from "jsonwebtoken"

export const verifyUser = (req, res, next) => {
  const token = req.cookies.access_token //get token from cookie
  if (!token) {
    return next(createError(401, "you are not authorized"))
  }
  //verify token
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return next(createError(401, "you are not authorized"))
    }
    //set user in the request object
    req.user = user
    next()
  })
}
