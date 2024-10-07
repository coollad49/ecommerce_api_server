import express, {Request} from "express";
import prisma from "@/lib/db"
import { Prisma } from "@prisma/client";
import {z} from "zod"
import { verifyAccessToken } from "@/lib/jwt";
import createHttpError from "http-errors";
import { customRequest } from "@/lib/Interfaces";

const cartRouter = express.Router()

cartRouter.get("/", verifyAccessToken, async(req, res, next)=>{
    try {
        const cart = await prisma.cart.findUnique({
            where: {
                ownerId: (req as customRequest).payload.user
            },

            include: {
                products: true
            }
        })
        if(!cart){
            await prisma.cart.create({
                data: {
                    ownerId: (req as customRequest).payload.user
                }
            })
        }

        if(cart) res.json(cart.products)
        
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === "P2025") {
                next(createHttpError.NotFound("Cart not found or already deleted"));
            } else {
                next(createHttpError.InternalServerError("Database error occurred"));
            }
        }
        else{
            next(error)
        }
    }
})

export {cartRouter}