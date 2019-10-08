import { Redis } from "ioredis"
import { Session } from "./types"

export interface ResolverMap {
    [key: string]: {
        [key: string]: (parent: any, args: any, context: {
            redis: Redis,
            url: string,
            session: Session
        }, info: any) => any
    }
}
