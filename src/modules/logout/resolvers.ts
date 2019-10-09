import { userSessionIdPrefix } from "../../constant"
import { ResolverMap } from "../../types/graphql-utils"
import { logger } from "../../utils/logger"

export const resolvers: ResolverMap = {
    Mutation: {
        logout: (_, __, {session}) => session.destroy((err) => {
            logger(err)
        }),

        logoutFromAll: async (_, __, {session, redis}) => {
            const {userId} = session
            if (!userId) {
                return false
            }

            const sessionIds = await redis.lrange(`${userSessionIdPrefix}${userId}`, 0, -1)
            const promises = []
            for (const sessionId of sessionIds) {
                promises.push(redis.del(`${userSessionIdPrefix}${sessionId}`))
            }

            await Promise.all(promises)

            return true
        }
    }
}
