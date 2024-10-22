import {z} from "zod";


const AuthSchema = z.object({
    email: z.string().email().toLowerCase().trim(),
    password: z.string()
    .min(8, "Password must be at least 8 characters long")
})

const ProductSchema = z.object({
    name: z.string().toLowerCase(),
    description: z.string().optional(),
    price: z.number(),
    stock: z.number(),
    categories: z.array(z.string()),
    img_url: z.string().optional()
})

const PatchedProductSchema = z.object({
    name: z.string().toLowerCase().optional(),
    description: z.string().optional(),
    price: z.number().optional(),
    stock: z.number().optional(),
});

const getProductSchema = z.number()

export {AuthSchema, ProductSchema, PatchedProductSchema, getProductSchema}