import { Redis } from "ioredis"
import { Session } from "./types"

export type Resolver = (
    parent: any,
    args: any,
    context: {
        redis: Redis,
        url: string,
        session: Session
    },
    info: any
) => any

export type GraphQLMiddleware = (
    resolver: Resolver,
    parent: any,
    args: any,
    context: {
        redis: Redis,
        url: string,
        session: Session
    },
    info: any
) => any

export interface ResolverMap {
    [key: string]: {
        [key: string]: Resolver
    }
}
