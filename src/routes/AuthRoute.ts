import express from "express";
import {register, login, refresh_token, logout} from "@/controller/Auth.Controller"

const authRouter = express.Router()

/**
 * @openapi
 * /auth/register:
 *  post:
 *      summary: Register a new user
 *      description: Creates a new user account and returns an access and refresh token.
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          email:
 *                              type: string
 *                              example: "user@example.com"
 *                          password:
 *                              type: password
 *                              example: "password123"
 *                      required:
 *                          - email
 *                          - password
 *      responses:
 *          200:
 *              description: User successfully registered and tokens generated.
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              accessToken:
 *                                  type: string
 *                                  description: The access token for the user.
 *                              refreshToken:
 *                                  type: string
 *                                  description: The refresh token for the user.
 *          400:
 *              description: Invalid input (e.g., validation error).
 *          500:
 *              description: Server error.
 */
authRouter.post('/register', register)

authRouter.post('/login', login)

authRouter.post('/refresh-token', refresh_token)

authRouter.delete('/logout', logout)




export {authRouter};