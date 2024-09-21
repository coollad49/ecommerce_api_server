import {z} from "zod"
import { createUser, loginUser } from "@/models/User";
import { signAccessToken, signRefreshToken, verifyRefreshToken } from "@/lib/jwt";
import createHttpError from "http-errors";
import client from "@/lib/redis";
import {Request, Response, NextFunction} from "express"

const login = async(req: Request, res: Response, next: NextFunction)=>{
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
}

const register = async(req: Request, res: Response, next: NextFunction)=>{
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
    
}

const refresh_token = async(req: Request, res: Response, next: NextFunction)=>{
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
}

const logout = async(req: Request, res: Response, next: NextFunction)=>{
    try{
        const {refreshToken} = req.body
        const userId = await verifyRefreshToken(refreshToken)
        if(!userId) throw createHttpError.Unauthorized()
        client.del(userId)
        
        res.sendStatus(204)
    
    } catch(error){
        next(error)
    }
}

export {register, login, logout, refresh_token}