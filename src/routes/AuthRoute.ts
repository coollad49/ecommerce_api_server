import express from "express";
import {z} from "zod"
import { createUser, loginUser } from "@/models/User";
import { signAccessToken, signRefreshToken, verifyRefreshToken } from "@/lib/jwt";
import createHttpError from "http-errors";

const authRouter = express.Router()

authRouter.post('/register', async(req, res, next)=>{
    try{
        const user = await createUser(req)
        const accessToken = await signAccessToken(user.id)
        const refreshToken = await signRefreshToken(user.id)
        res.send({accessToken, refreshToken})
    }
    catch(error){
        if (error instanceof z.ZodError) {
            next(error.issues[0]);
        }
        else{
            next(error)
        }
        
    }
    
})

authRouter.post('/login', async(req, res, next)=>{
    try{
        const user = await loginUser(req)
        const accessToken = await signAccessToken(user.id)
        const refreshToken = await signRefreshToken(user.id)
        res.send({accessToken, refreshToken})
    } catch(error){
        if (error instanceof z.ZodError) {
            return next(createHttpError.BadRequest("Invalid email/password"));
        }

        next(error)
    }
})

authRouter.post('/refresh-token', async(req, res, next)=>{
    try {
        const {refreshToken} = req.body;
        if(!refreshToken) throw createHttpError.BadRequest()
        const userId = await verifyRefreshToken(refreshToken)
        
        const accessToken = await signAccessToken(userId)
        const refToken = await signRefreshToken(userId)
        res.send({accessToken: accessToken, refreshToken: refToken})
        
    } catch (error) {
        next(error)
    }
})

authRouter.delete('/logout', async(req, res, next)=>{
    res.send("Logout route")
})




export {authRouter};