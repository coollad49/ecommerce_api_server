import prisma from "@/lib/db"
import { AuthSchema } from "@/lib/schema";
import createHttpError from "http-errors";
import bcrypt from "bcrypt"

const createUser = async(req:any) =>{
    const validatedData = AuthSchema.parse(req.body)
    const {email, password} = validatedData

    const userExists = await prisma.user.findUnique({
        where: {
            email: email
        }
    })

    if(userExists) throw createHttpError.Conflict(`${email} exists already`)
    const salt = await bcrypt.genSalt(10)

    const hashedPassword = await bcrypt.hash(password, salt)

    const user = await prisma.user.create({
        data: {
            email: email,
            hashedPassword: hashedPassword
        }
    })

    return user
}

export {createUser}