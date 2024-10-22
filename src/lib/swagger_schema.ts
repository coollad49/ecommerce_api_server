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