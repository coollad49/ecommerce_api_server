import express from "express";
import prisma from "@/lib/db"
import { Prisma } from "@prisma/client";
import {z} from "zod"
import { ProductSchema, PatchedProductSchema, getProductSchema } from "@/lib/schema";
import { verifyAccessToken } from "@/lib/jwt";
import createHttpError from "http-errors";

const productRouter = express.Router()

/**
     * @openapi
     * /products:
     *  get:
     *      tags:
     *          - Products
     *      description: Get all available Products.
     *      responses:
     *          200:
     *              description: Success.
     */
productRouter.get("/", async(req, res, next)=>{
    const products = await prisma.product.findMany()
    res.json(products)
})

/**
 * @openapi
 * '/products/{id}':
 *  get:
 *      tags:
 *          - Products
 *      summary: Get a single product by productId
 *      parameters:
 *      - name: id
 *        in: path
 *        description: The id of the product
 *        required: true
 *      responses:
 *          200:
 *              description: Success
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schema/getProduct'
 *          404:
 *              description: Product not found. 
 */
productRouter.get("/:id", async(req, res, next)=>{
    try{
        const id = getProductSchema.parse(parseInt(req.params.id))
        const product = await prisma.product.findUnique({
            where: {
                id: id
            }
        })
        if(!product) throw createHttpError.NotFound("Product not found")

        res.json(product)
    } catch(error){
        if (error instanceof z.ZodError) {
            next(error.issues[0]);
        }
        else{
            next(error)
        }
    }
})

/**
 * @openapi
 * /products:
 *  post:
 *      tags:
 *          - Products
 *      security:
 *          - bearerAuth: []
 *      summary: Create a new product
 *      description: This endpoint allows authorized users (typically admins or store managers) to create a new product. Users must provide the necessary product details such as name, description, price, and category. The new product will then be saved in the database, and a response containing the created product's information will be returned. Validation ensures that all required fields are provided and meet the expected criteria. If any required data is missing or invalid, an error response will be returned.
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schema/CreateProduct'
 *      responses:
 *          201:
 *              description: Product successfully created.
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              id:
 *                                  type: string
 *                                  description: The ID of the newly created product.
 *                                  example: "abc123"
 *                              name:
 *                                  type: string
 *                                  description: The name of the product.
 *                                  example: "Nike Shoe"
 *                              description:
 *                                  type: string
 *                                  description: The description of the product.
 *                                  example: "A nice brand"
 *                              price:
 *                                  type: number
 *                                  description: The price of the product.
 *                                  example: 10000
 *                              stock:
 *                                  type: number
 *                                  description: The available stock of the product.
 *                                  example: 4
 *                              categories:
 *                                  type: array
 *                                  items:
 *                                      type: string
 *                                      description: The categories of the product.
 *                                      example: ["Shoes", "Sports"]
 *          400:
 *              description: Bad request, invalid or missing data.
 *          401:
 *              description: Unauthorized, invalid or missing token.
 *          500:
 *              description: Server error.
 */
productRouter.post("/", verifyAccessToken, async(req, res, next)=>{
    try{
        const validatedData = ProductSchema.parse(req.body)
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
        else if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === "P2025") {
                next(createHttpError.NotFound("Product not found or already deleted"));
            } else {
                next(createHttpError.InternalServerError("Database error occurred"));
            }
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
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === "P2025") {
                next(createHttpError.NotFound("Product not found or already deleted"));
            } else {
                next(createHttpError.InternalServerError("Database error occurred"));
            }
        } else{
          next(error)  
        }
        
    }
    

})

export {productRouter}