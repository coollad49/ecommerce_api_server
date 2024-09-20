import {createClient} from "redis"

const client = createClient()

client.on("connect", ()=>{
    console.log("client connected to redis...")
})
client.on("ready", ()=>{
    console.log("client connected to redis and ready to use...")
})
client.on("error", (err)=>{
    throw err.message
})

client.on("end", ()=>{
    console.log("client disconnected from redis")
})

process.on("SIGINT", ()=>{
    client.quit()
})

export default client;