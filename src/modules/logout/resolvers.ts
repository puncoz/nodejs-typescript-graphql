import { ResolverMap } from "../../types/graphql-utils"
import { logger } from "../../utils/logger"

export const resolvers: ResolverMap = {
    Mutation: {
        logout: (_, __, {session}) => session.destroy((err) => {
            logger(err)
        })
    }
}
