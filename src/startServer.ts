import { importSchema } from "graphql-import"
import { GraphQLServer } from "graphql-yoga"
import { join } from "path"
import { resolvers } from "./resolvers"
import { createTypeOrmConnection } from "./utils/createTypeOrmConnection"

export const startServer = async (callback: any) => {
    const typeDefs = importSchema(join(__dirname, "./schema.graphql"))

    const server = new GraphQLServer({typeDefs, resolvers})

    await createTypeOrmConnection()

    const port = process.env.NODE_ENV === "test" ? 0 : 4001
    return server.start({port}, callback)
}
