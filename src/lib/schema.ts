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
 *      getProduct:
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

/**
 * @openapi
 * components:
 *  schema:
 *      CreateProduct:
 *          type: object
 *          properties:
 *              name:
 *                  type: string
 *                  example: "Nike Shoe"
 *              description:
 *                  type: string
 *                  example: "A nice brand"
 *              price:
 *                  type: number
 *                  example: 10000
 *              stock:
 *                  type: number
 *                  example: 4
 *              categories:
 *                  type: array
 *                  items:
 *                      type: string
 *                  example: ["Shoes", "Sports"]
 *          required:
 *              - name
 *              - price
 *              - stock
 *              - categories
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