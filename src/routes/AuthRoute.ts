import express from "express";
import {register, login, refresh_token, logout} from "@/controller/Auth.Controller"

const authRouter = express.Router()

/**
 * @openapi
 * '/auth/register':
 *  post:
 *      tags:
 *          - User
 *      summary: Register a user
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schema/CreateUserInput'
 *      responses:
 *          200:
 *              description: Success
 *              content:
 *                  application/json:
 *                      schema:
 *          409:
 *              description: Conflict
 *          400:
 *              description: Bad request
 */
authRouter.post('/register', register)

authRouter.post('/login', login)

authRouter.post('/refresh-token', refresh_token)

authRouter.delete('/logout', logout)




export {authRouter};