import express from "express";
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
            where: { ownerId: (req as customRequest).payload.user},
            include: {
                products: {
                    include: { product: { select: { id: true, name: true, price: true, description: true }}}
                }
            }
        })
        if(!cart){
            await prisma.cart.create({
                data: {ownerId: (req as customRequest).payload.user}
            })
            return res.json([]);
        }
        const sanitizedJSON = cart!.products.map((item)=>({
            productId: item.product.id,
            name: item.product.name,
            price: item.product.price,
            description: item.product.description,
            quantity: item.quantity
        }))
        if(cart) res.json(sanitizedJSON)
        
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
            where: { cartId_productId: { cartId: cart!.id, productId: parseInt(productId) }}
        })
        if(existingCartItem){
            await prisma.cartItem.update({
                where: { id: existingCartItem.id },
                data: { quantity: existingCartItem.quantity + (quantity || 1) }
            })
        } else{
            await prisma.cartItem.create({
                data: { cartId: cart!.id, productId: parseInt(productId), quantity: quantity || 1 },
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

cartRouter.delete("/:productId", verifyAccessToken, async(req, res, next)=>{
    const { productId } = req.params;
    try{
        let cart = await prisma.cart.findUnique({
            where: {ownerId: (req as customRequest).payload.user}
        })
        if(!cart) throw createHttpError.NotFound("cart not Found !!")

        const deleteCartItem = await prisma.cartItem.delete({
            where: {
                cartId_productId: {
                    cartId: cart.id,
                    productId: parseInt(productId)
                }
            },
            include: {
                product: { select: { id: true, name: true, price: true, stock: true, description: true }}
            }
        })

        if(!deleteCartItem) throw createHttpError.NotFound("Product not in Cart..")
        const sanitizedJSON = deleteCartItem.product;
        res.send({ message: "Product deleted successfully", Product: sanitizedJSON})
    } catch(error){
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === "P2025") {
                next(createHttpError.NotFound("Product not in Cart.."));
            } else {
                next(createHttpError.InternalServerError("Database error occurred"));
            }
        }
        else{
            next(error)
        }
    }
})

cartRouter.delete("/", verifyAccessToken, async(req, res, next)=>{
    try {
        await prisma.cart.delete({
            where: { ownerId: (req as customRequest).payload.user},
        })

        res.status(200).send({message: "Cart Deleted"})
        
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