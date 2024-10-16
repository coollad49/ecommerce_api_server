import {z} from "zod";


/**
 * @openapi
 * components:
 *  schema:
 *      CreateUserInput:
 *          type: object
 *          required:
 *              - email
 *              - password
 *          properties:
 *              email:
 *                  type: string
 *                  default: jane.doe@example.com            
 *              password:
 *                  type: string
 *                  default: stringpassword123
 */
const AuthSchema = z.object({
    email: z.string().email().toLowerCase().trim(),
    password: z.string()
    .min(8, "Password must be at least 8 characters long")
})

/**
 * @openapi
 * components:
 *  schema:
 *      Product:
 *          type: object
 *          required:
 *              - name
 *              - description
 *              - price
 *              - stock
 *              - img_url
 *          properties:
 *              name:
 *                  type: string
 *              description:
 *                  type: string
 *              price:
 *                  type: number
 *              stock:
 *                  type: number
 *              img_url:
 *                  type: string
 */
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