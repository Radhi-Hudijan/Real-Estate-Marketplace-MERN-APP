import express from "express"
import {
  deleteUser,
  getUser,
  updateUser,
} from "../controllers/user.controller.js"
import { verifyUser } from "../utils/verifyUser.js"

const router = express.Router()

router.get("/", getUser)

router.post("/update/:id", verifyUser, updateUser)
router.delete("/delete/:id", verifyUser, deleteUser)

export default router
