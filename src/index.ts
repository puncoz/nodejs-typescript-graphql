import { importSchema } from "graphql-import"
import { GraphQLServer } from "graphql-yoga"
import { join } from "path"
import "reflect-metadata"
import { createConnection } from "typeorm"
import { resolvers } from "./resolvers"

export const startServer = async () => {
    const typeDefs = importSchema(join(__dirname, "./schema.graphql"))

    const server = new GraphQLServer({typeDefs, resolvers})

    await createConnection()

    const port = 4001
    await server.start({port})
    console.log(`Server is running on localhost: ${port}`)
}

(async () => {
    await startServer()
})()
