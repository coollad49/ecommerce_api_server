import express from "express";

const authRouter = express.Router()

authRouter.post('/register', async(req, res, next)=>{
    res.send("register route")
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