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

/**
 * @openapi
 * /auth/login:
 *  post:
 *      summary: Log in a user
 *      description: Authenticate a user by validating their credentials and returning an access token and refresh token. These tokens can be used to access protected resources and refresh the session.
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
 *              description: User successfully logged in.
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              accessToken:
 *                                  type: string
 *                              refreshToken:
 *                                  type: string
 *          400:
 *              description: User not Found.
 *          401:
 *              description: Email/Password not valid
 *          500:
 *              description: Server error.
 */
authRouter.post('/login', login)

authRouter.post('/refresh-token', refresh_token)

/**
 * @openapi
 * /auth/logout:
 *  delete:
 *      summary: log out a user
 *      description: Invalidate the user's refresh token to terminate the session, ensuring the user cannot use the token to refresh their access token anymore.
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          refreshToken:
 *                              type: string
 *                              example: "some-refresh-token"
 *                      required:
 *                          - refreshToken
 *      responses:
 *          204:
 *              description: User succesfully logged out.
 *          400:
 *              description: Invalid or missing refresh token.
 *          500:
 *              description: Server error.
 */
authRouter.delete('/logout', logout)




export {authRouter};