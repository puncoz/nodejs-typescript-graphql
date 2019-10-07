import { importSchema } from "graphql-import"
import { GraphQLServer } from "graphql-yoga"
import { join } from "path"
import "reflect-metadata"
import { resolvers } from "./resolvers"
import { createTypeOrmConnection } from "./utils/createTypeOrmConnection"

export const startServer = async () => {
    const typeDefs = importSchema(join(__dirname, "./schema.graphql"))

    const server = new GraphQLServer({typeDefs, resolvers})

    await createTypeOrmConnection()

    const port = 4001
    await server.start({port})
    console.log(`Server is running on localhost: ${port}`)
}

(async () => {
    await startServer()
})()
