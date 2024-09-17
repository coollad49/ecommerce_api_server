import jwt, {SignOptions, JwtPayload, Secret} from "jsonwebtoken"
import createHttpError from "http-errors"
import { Request, response, NextFunction } from "express"

interface customRequest extends Request{
    payload?: any;
}

const signAccessToken = async(userid: string) => {
    try{
        const payload: JwtPayload = {
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

const signRefreshToken = async(userid: string) => {
    try{
        const payload: JwtPayload = {
        }
        const secret: Secret = process.env.REFRESH_TOKEN_SECRET!
        const options: SignOptions = {
            expiresIn: "1y",
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

const verifyAccessToken = (req:any, res:any, next:any )=>{
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

const verifyRefreshToken = (token: string): Promise<string> => {
    const secret = process.env.REFRESH_TOKEN_SECRET!

    return new Promise((resolve, reject) => {
      jwt.verify(token, secret, (err, payload:any) => {
        if (err) {
          reject(createHttpError.Unauthorized())
        } else {
          const userId: string = payload.aud
          resolve(userId)
        }
      })
    })
}

export {signAccessToken, verifyAccessToken, signRefreshToken, verifyRefreshToken}