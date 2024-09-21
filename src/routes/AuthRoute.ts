import express from "express";
import {register, login, refresh_token, logout} from "@/controller/Auth.Controller"

const authRouter = express.Router()

authRouter.post('/register', register)

authRouter.post('/login', login)

authRouter.post('/refresh-token', refresh_token)

authRouter.delete('/logout', logout)




export {authRouter};