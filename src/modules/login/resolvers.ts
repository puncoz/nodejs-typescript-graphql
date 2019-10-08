import { compare } from "bcryptjs"
import { User } from "../../entity/User"
import { ResolverMap } from "../../types/graphql-utils"
import { invalidLogin, notVerified } from "./errorMessages"

const errorResponse = [{
    path: "email",
    message: invalidLogin
}]

export const resolvers: ResolverMap = {
    Mutation: {
        login: async (_, {email, password}: GQL.ILoginOnMutationArguments, {session}) => {
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

            return null
        }
    }
}
