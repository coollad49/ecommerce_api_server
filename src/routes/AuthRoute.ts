import express from "express";
import {register, login, refresh_token, logout} from "@/controller/Auth.Controller"

const authRouter = express.Router()

/**
 * @openapi
 * /auth/register:
 *  post:
 *      tags:
 *          - Auth
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
 *      tags:
 *          - Auth
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

/**
 * @openapi
 * /auth/refresh-token:
 *  post:
 *      tags:
 *          - Auth
 *      summary: Refresh user access token
 *      description: Allows users to obtain a new access token using a valid refresh token. This route verifies the provided refresh token and, if valid, issues a new access token. This helps maintain user sessions without requiring them to log in again, enhancing user experience while ensuring security. If the refresh token is invalid or expired, an appropriate error response is returned.
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
 *          200:
 *              description: New access token successfully issued.
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              accessToken:
 *                                  type: string
 *                              refreshToken:
 *                                  type: string
 *          401:
 *              description: Invalid or expired refresh token.
 *          500:
 *              description: Server error.
 *          
 */
authRouter.post('/refresh-token', refresh_token)

/**
 * @openapi
 * /auth/logout:
 *  delete:
 *      tags:
 *          - Auth
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
 *              description: Invalid or expired refresh token.
 *          500:
 *              description: Server error.
 */
authRouter.delete('/logout', logout)




export {authRouter};