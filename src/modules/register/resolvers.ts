import { hash } from "bcryptjs"
import { User } from "../../entity/User"
import { ResolverMap } from "../../types/graphql-utils"

export const resolvers: ResolverMap = {
    Mutation: {
        register: async (_, {email, password}: GQL.IRegisterOnMutationArguments) => {
            const userAlreadyExists = await User.findOne({where: {email}, select: ["id"]})
            if (userAlreadyExists) {
                return [
                    {
                        path: "email",
                        message: "already token"
                    }
                ]
            }

            const hashedPassword = await hash(password, 10)
            const user = User.create({
                email,
                password: hashedPassword
            })

            await user.save()

            return null
        }
    }
}
