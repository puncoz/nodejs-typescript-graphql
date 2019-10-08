import * as connecRedis from "connect-redis"
import * as session from "express-session"
import { GraphQLServer } from "graphql-yoga"
import { redis } from "./redis"
import { confirmEmail } from "./routes/confirmEmail"
import { createTypeOrmConnection } from "./utils/createTypeOrmConnection"
import { stitchesSchema } from "./utils/stitchesSchema"

const RedisStore = connecRedis(session)

export const startServer = async (callback: any) => {
    const server = new GraphQLServer({
        schema: stitchesSchema(),
        context: ({request}) => ({
            redis,
            url: `${request.protocol}://${request.get("host")}`,
            session: request.session
        })
    })

    server.express.use(session({
        name: "qid",
        store: new RedisStore({
            client: redis as any
        }),
        secret: "some-secret",
        resave: false,
        saveUninitialized: false,
        cookie: {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 1000 * 60 * 60 * 24 * 7
        }
    }))

    server.express.get("/confirm/:token", confirmEmail)

    await createTypeOrmConnection()

    const cors = {
        credentials: true,
        origin: process.env.NODE_ENV === "test" ? "*" : (process.env.FRONTEND_URL as string)
    }
    const port = process.env.NODE_ENV === "test" ? 0 : 4001
    return server.start({cors, port}, callback)
}
