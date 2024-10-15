import express from "express";
import morgan from "morgan";
import dotenv from "dotenv";
import routes from "@/routes"
import client from "@/lib/redis";
import swaggerDocs from "@/lib/swagger";

// const initializeRedis = async()=>{
//     try{
//         await client.connect();
//     } catch(error){
//         console.error('Error connecting to Redis:', error);
//     }
// }
// initializeRedis()

dotenv.config()

const port = process.env.PORT || 3000
const app = express()

app.use(morgan("dev"))
app.use(express.json())

swaggerDocs(app, port)

routes(app)

app.listen(port, ()=>{
    console.log(`Server running on port ${port}`)
})