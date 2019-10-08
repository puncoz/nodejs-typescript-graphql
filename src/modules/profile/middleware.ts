import { Resolver } from "../../types/graphql-utils"
import { logger } from "../../utils/logger"

export default async (resolver: Resolver, ...params: any[]) => {
    const [parent, args, context, info] = params
    logger(context.session)

    if (!context.session || !context.session.userId) {
        throw new Error("unauthenticated")
    }

    return resolver(parent, args, context, info)
}
