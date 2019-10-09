import { Resolver } from "../../types/graphql-utils"

export default async (resolver: Resolver, ...params: any[]) => {
    const [parent, args, context, info] = params

    if (!context.session || !context.session.userId) {
        throw new Error("unauthenticated")
    }

    return resolver(parent, args, context, info)
}
