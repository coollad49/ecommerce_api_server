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
                data: {ownerId: (req as customRequest).payload.user}
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

cartRouter.post("/:productId", verifyAccessToken, async(req, res, next)=>{
    const { productId } = req.params;
    const {quantity} = req.body;
    try{
        let cart = await prisma.cart.findUnique({
            where: {ownerId: (req as customRequest).payload.user}
        })
        if(!cart){
            await prisma.cart.create({
                data: {ownerId: (req as customRequest).payload.user}
            })
        }

        const existingCartItem = await prisma.cartItem.findUnique({
            where: {
                cartId_productId: {
                    cartId: cart!.id,
                    productId: parseInt(productId)
                }
            }
        })
        if(existingCartItem){
            await prisma.cartItem.update({
                where: {
                    id: existingCartItem.id
                },
                data: {
                    quantity: existingCartItem.quantity + (quantity || 1)
                }
            })
        } else{
            await prisma.cartItem.create({
                data: {
                    cartId: cart!.id,
                    productId: parseInt(productId),
                    quantity: quantity || 1,
                },
            });
        }

        res.status(200).json({message: "Product added to cart successfully"})

    } catch(error){
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