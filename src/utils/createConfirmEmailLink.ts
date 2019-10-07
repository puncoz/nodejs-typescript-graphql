import { Redis } from "ioredis"
import { v4 as uuidV4 } from "uuid"

export const createConfirmEmailLink = async (url: string, userId: string, redis: Redis) => {
    const token = uuidV4()

    await redis.set(token, userId, "ex", 60 * 60 * 24)

    return `${url}/confirm/${token}`
}
