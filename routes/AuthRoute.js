import express from "express";
import createHttpError from "http-errors";

const authRouter = express.Router()

authRouter.post('/register', async(req, res, next)=>{
    try{
        const {email, password} = req.body

        if(!email || !password) throw createHttpError.BadRequest()
    }
    catch(error){
        next(error)
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