import "dotenv/config"
import "reflect-metadata"
import { startServer } from "./startServer"

(async () => {
    await startServer(({port}: any) => {
        console.log(`Server is running on localhost: ${port}`)
    })
})()
