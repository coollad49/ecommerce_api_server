import express from "express";
import createHttpError from "http-errors";
import prisma from "@/lib/db"
import { AuthSchema } from "@/lib/schema";
import {z} from "zod"

const authRouter = express.Router()

authRouter.post('/register', async(req, res, next)=>{
    try{
        const validatedData = AuthSchema.parse(req.body)
        const {email, password} = validatedData

        const userExists = await prisma.user.findUnique({
            where: {
                email: email
            }
        })

        if(userExists) throw createHttpError.Conflict(`${email} exists already`)
        
        const user = await prisma.user.create({
            data: {
                email: email,
                hashedPassword: password
            }
        })

        res.send(user)
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