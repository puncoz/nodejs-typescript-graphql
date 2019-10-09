import { compare } from "bcryptjs"
import { userSessionIdPrefix } from "../../constant"
import { User } from "../../entity/User"
import { ResolverMap } from "../../types/graphql-utils"
import { invalidLogin, notVerified } from "./errorMessages"

const errorResponse = [{
    path: "email",
    message: invalidLogin
}]

export const resolvers: ResolverMap = {
    Mutation: {
        login: async (_, {email, password}: GQL.ILoginOnMutationArguments, {session, redis, req}) => {
            const user = await User.findOne({where: {email}})
            if (!user) {
                return errorResponse
            }

            const passwordMatched = await compare(password, user.password)
            if (!passwordMatched) {
                return errorResponse
            }

            if (!user.verified) {
                return [{
                    path: "email",
                    message: notVerified
                }]
            }

            session.userId = user.id
            if (req.sessionID) {
                await redis.lpush(`${userSessionIdPrefix}${user.id}`, req.sessionID)
            }

            return null
        }
    }
}
