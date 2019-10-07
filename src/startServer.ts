import * as fs from "fs"
import { GraphQLSchema } from "graphql"
import { importSchema } from "graphql-import"
import { makeExecutableSchema, mergeSchemas } from "graphql-tools"
import { GraphQLServer } from "graphql-yoga"
import * as Redis from "ioredis"
import { join } from "path"
import { User } from "./entity/User"
import { createTypeOrmConnection } from "./utils/createTypeOrmConnection"

export const startServer = async (callback: any) => {
    const schemas: GraphQLSchema[] = []
    const folders = fs.readdirSync(join(__dirname, "./modules"))
    folders.forEach(folder => {
        const {resolvers} = require(`./modules/${folder}/resolvers`)
        const typeDefs = importSchema(join(__dirname, `./modules/${folder}/${folder}.graphql`))
        schemas.push(makeExecutableSchema({resolvers, typeDefs}))
    })

    const redis = new Redis()

    const server = new GraphQLServer({
        schema: mergeSchemas({schemas}),
        context: ({request}) => ({
            redis,
            url: `${request.protocol}://${request.get("host")}`
        })
    })

    server.express.get("/confirm/:token", async (req, res) => {
        const {token} = req.params
        const userId: any = await redis.get(token)
        if(userId) {
            await User.update({id: userId}, {verified: true})
            res.send("ok")
        } else {
            res.send("invalid.")
        }
    })

    await createTypeOrmConnection()

    const port = process.env.NODE_ENV === "test" ? 0 : 4001
    return server.start({port}, callback)
}
