import express from "express"
import { googleOAuth, signup, singin } from "../controllers/auth.controller.js"

const router = express.Router()

router.post("/signup", signup)

router.post("/signin", singin)

router.post("/google", googleOAuth)

export default router
