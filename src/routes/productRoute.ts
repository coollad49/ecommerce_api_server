import express from "express";
import prisma from "@/lib/db"
import {z} from "zod"
import { ProductSchema, PatchedProductSchema } from "@/lib/schema";
import { verifyAccessToken } from "@/lib/jwt";
import createHttpError from "http-errors";

const productRouter = express.Router()

productRouter.get("/", async(req, res, next)=>{
    const products = await prisma.product.findMany()
    res.json(products)
})

productRouter.get("/:id", async(req, res, next)=>{
    try{
        const product = await prisma.product.findUnique({
            where: {
                id: parseInt(req.params.id)
            }
        })
        if(!product) throw createHttpError.NotFound("Product not found")

        res.json(product)
    } catch(error){
        next(error)
    }
})

productRouter.post("/", verifyAccessToken, async(req, res, next)=>{
    try{
        console.log(req.body)
        const validatedData = ProductSchema.parse(req.body)
        console.log(validatedData)
        const {name, description, price, stock, categories} = validatedData
        const product = await prisma.product.create({
            data: {
                name, description, price, stock,
                categories: {
                    connectOrCreate: categories.map((category)=>({
                        where: {
                            name: category
                        },
                        create: {
                            name: category
                        }
                    }))
                }
            }
        })
        res.send({ message: "Product added successfully", product: product})
    } catch(error){
        if (error instanceof z.ZodError) {
            next(error.issues[0]);
        }
        else{
            next(error)
        }
    }
})

productRouter.patch("/:id", verifyAccessToken, async(req, res, next)=>{
    try{
        const validatedData = PatchedProductSchema.parse(req.body)
        const {name, description, price, stock} = validatedData

        const filteredData: any = {}
        if(name !== undefined) filteredData.name = name;
        if(description !== undefined) filteredData.description = description;
        if(price !== undefined) filteredData.price = price;
        if(stock !== undefined) filteredData.stock = stock;

        const product = await prisma.product.update({
            where: {
                id: parseInt(req.params.id)
            },
            data: filteredData
        })
        res.send({ message: "Product updated successfully", product: product })
    } catch(error){
        if (error instanceof z.ZodError) {
            next(error.issues[0]);
        }
        else{
            next(error)
        }
    }
})

productRouter.delete("/:id", verifyAccessToken, async(req, res, next)=>{
    try{
        const deletedProduct = await prisma.product.delete({
            where: {
                id: parseInt(req.params.id)
            }
        })
        if (!deletedProduct) throw createHttpError.NotFound("Product not found")
        
        res.send({ message: "Product deleted successfully", product: deletedProduct })
    } catch(error){
        next(error)
    }
    

})

export {productRouter}