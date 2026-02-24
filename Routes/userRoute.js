import express from "express"
import { login, register, forgetPassword, resetPassword } from "../Controllers/userController.js"

const route = express.Router()


route.post("/register", register)
route.post("/login", login)
route.post("/forget-password", forgetPassword)
route.post("/reset-password/:token", resetPassword)


export default route