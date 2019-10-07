import * as fs from "fs"
import { GraphQLSchema } from "graphql"
import { importSchema } from "graphql-import"
import { makeExecutableSchema, mergeSchemas } from "graphql-tools"
import { GraphQLServer } from "graphql-yoga"
import { join } from "path"
import { createTypeOrmConnection } from "./utils/createTypeOrmConnection"

export const startServer = async (callback: any) => {
    const schemas: GraphQLSchema[] = []
    const folders = fs.readdirSync(join(__dirname, "./modules"))
    folders.forEach(folder => {
        const {resolvers} = require(`./modules/${folder}/resolvers`)
        const typeDefs = importSchema(join(__dirname, `./modules/${folder}/${folder}.graphql`))
        schemas.push(makeExecutableSchema({resolvers, typeDefs}))
    })

    const server = new GraphQLServer({schema: mergeSchemas({schemas})})

    await createTypeOrmConnection()

    const port = process.env.NODE_ENV === "test" ? 0 : 4001
    return server.start({port}, callback)
}
