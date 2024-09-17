import express from "express";
import {z} from "zod"
import { createUser } from "@/models/User";
import { signAccessToken } from "@/lib/jwt";

const authRouter = express.Router()

authRouter.post('/register', async(req, res, next)=>{
    try{
        const user = await createUser(req)
        const accessToken = await signAccessToken(user.id)
        res.send({accessToken})
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
    res.send("login route")
})

authRouter.post('/refresh-token', async(req, res, next)=>{
    res.send("refresh token route")
})

authRouter.delete('/logout', async(req, res, next)=>{
    res.send("Logout route")
})




export {authRouter};