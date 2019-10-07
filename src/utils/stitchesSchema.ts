import * as fs from "fs"
import { GraphQLSchema } from "graphql"
import { importSchema } from "graphql-import"
import { makeExecutableSchema, mergeSchemas } from "graphql-tools"
import { join } from "path"

export const stitchesSchema = () => {
    const schemas: GraphQLSchema[] = []
    const folders = fs.readdirSync(join(__dirname, "../modules"))
    folders.forEach(folder => {
        const {resolvers} = require(`../modules/${folder}/resolvers`)
        const typeDefs = importSchema(join(__dirname, `../modules/${folder}/${folder}.graphql`))
        schemas.push(makeExecutableSchema({resolvers, typeDefs}))
    })

    return mergeSchemas({schemas})
}
