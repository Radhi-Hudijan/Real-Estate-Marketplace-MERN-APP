import express from "express"
import {
  deleteUser,
  updateUser,
  getUserListing,
  getUser,
} from "../controllers/user.controller.js"
import { verifyUser } from "../utils/verifyUser.js"

const router = express.Router()

router.post("/update/:id", verifyUser, updateUser)
router.delete("/delete/:id", verifyUser, deleteUser)
router.get("/listings/:id", verifyUser, getUserListing)
router.get("/:id", verifyUser, getUser)

export default router
