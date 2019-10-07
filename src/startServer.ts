import { GraphQLServer } from "graphql-yoga"
import { redis } from "./redis"
import { confirmEmail } from "./routes/confirmEmail"
import { createTypeOrmConnection } from "./utils/createTypeOrmConnection"
import { stitchesSchema } from "./utils/stitchesSchema"

export const startServer = async (callback: any) => {
    const server = new GraphQLServer({
        schema: stitchesSchema(),
        context: ({request}) => ({
            redis,
            url: `${request.protocol}://${request.get("host")}`
        })
    })

    server.express.get("/confirm/:token", confirmEmail)

    await createTypeOrmConnection()

    const port = process.env.NODE_ENV === "test" ? 0 : 4001
    return server.start({port}, callback)
}
