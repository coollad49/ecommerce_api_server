import jwt, {SignOptions, JwtPayload, Secret} from "jsonwebtoken"
import createHttpError from "http-errors"

const signAccessToken = async(userid: string) => {
    try{
        const payload: JwtPayload = {
        }
        const secret: Secret = "powerful word of God"
        const options: SignOptions = {
            expiresIn: "1hr",
            issuer: "lucasbuilds",
            audience: userid
        }
    
        const token = jwt.sign(payload, secret, options);
        return token
    } catch(error){
        throw error
    }
    
}

export {signAccessToken}