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
        login: async (_, {email, password}: GQL.ILoginOnMutationArguments) => {
            const user = await User.findOne({where: {email}})
            if (!user) {
                return errorResponse
            }

            const passwordMatched = await compare(password, user.password)
            console.log(email, password, passwordMatched ? "true" : "false")
            if (!passwordMatched) {
                return errorResponse
            }

            if (!user.verified) {
                return [{
                    path: "email",
                    message: notVerified
                }]
            }

            return null
        }
    }
}