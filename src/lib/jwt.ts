import jwt, {SignOptions, JwtPayload, Secret} from "jsonwebtoken"
import createHttpError from "http-errors"
import client from "@/lib/redis"
import { customRequest } from "@/lib/Interfaces"
import { Request, Response, NextFunction } from "express"

const signAccessToken = async(userid: string) => {
    try{
        const payload: JwtPayload = {
            user: userid
        }
        const secret: Secret = process.env.ACCESS_TOKEN_SECRET!
        const options: SignOptions = {
            expiresIn: "1hr",
            issuer: "lucasbuilds",
            audience: userid
        }
    
        const token = jwt.sign(payload, secret, options);
        return token
    } catch(error){
        console.error(error)
        throw createHttpError.InternalServerError()
    }
    
}

const signRefreshToken = async(userId: string) => {
    try{
        const payload: JwtPayload = {
        }
        const secret: Secret = process.env.REFRESH_TOKEN_SECRET!
        const expiringData = 365*24*60*60
        const options: SignOptions = {
            expiresIn: "1y",
            issuer: "lucasbuilds",
            audience: userId
        }
    
        const token = jwt.sign(payload, secret, options);
        // client.set(userId, token, {
        //     EX: expiringData,
        // })
        
        return token
    } catch(error){
        console.error(error)
        throw createHttpError.InternalServerError()
    }
    
}

const verifyAccessToken = (req:Request, res:Response, next:NextFunction )=>{
    if(!req.headers['authorization']) throw next(createHttpError.Unauthorized())
    const authHeader = req.headers['authorization']
    const bearerToken = authHeader.split(" ")
    const token = bearerToken[1]
    const secret = process.env.ACCESS_TOKEN_SECRET!
    jwt.verify(token, secret, (err:any, payload:any) => {
        if(err){
            const message = err.name === 'JsonWebTokenError' ? 'UnAuthorized' : err.message
            return next(createHttpError.Unauthorized(message))
        }
        (req as customRequest).payload = payload
        next()
    })
}

const verifyRefreshToken = async(token: string) => {
    const secret = process.env.REFRESH_TOKEN_SECRET!

    try {
        const payload = await new Promise((resolve, reject) => {
          jwt.verify(token, secret, (err, decoded) => {
            if (err) {
              return reject(createHttpError.Unauthorized());
            }
            resolve(decoded);
          });
        });
        
        const userId: string = (payload as any).aud;
        const tokenInRedis = await client.get(userId)
        if(tokenInRedis === token) return userId
        throw createHttpError.InternalServerError()
    } catch (error) {
        throw error;  // Or handle the error differently depending on your app's flow
    }
}

export {signAccessToken, verifyAccessToken, signRefreshToken, verifyRefreshToken}