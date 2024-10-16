import { Express, Request, Response, NextFunction } from "express";
import { authRouter } from "@/routes/AuthRoute"
import { productRouter } from "@/routes/productRoute";
import { verifyAccessToken } from "@/lib/jwt";
import { cartRouter } from "@/routes/cartRoute";
import createHttpError from "http-errors";

function routes(app: Express){

    /**
     * @openapi
     * /:
     *  get:
     *      tags:
     *          - Home
     *      description: default route
     *      responses:
     *          200:
     *              description: Success.
     *          401:
     *              description: Unauthorized.
     */
    app.get('/', verifyAccessToken, async(req, res, next)=>{
        res.send("Jesus is glorified!!!")
    })
    
    app.use('/auth', authRouter)
    
    app.use('/products', productRouter)
    
    app.use("/cart", cartRouter)
    
    app.use(async (req, res, next)=>{
        next(createHttpError.NotFound())
    })
    
    app.use((err:any, req:Request, res:Response, next:NextFunction)=>{
        res.status(err.status || 500)
        res.send({
            error: {
                status: err.status || 500,
                message: err.message,
            },
        })
    })
}

export default routes;