import { GraphQLMiddleware, Resolver } from "../types/graphql-utils"

export const createMiddleware = (
    middleware: GraphQLMiddleware,
    resolver: Resolver
) => (
    parent: any,
    args: any,
    context: any,
    info: any
) => middleware(resolver, parent, args, context, info)
