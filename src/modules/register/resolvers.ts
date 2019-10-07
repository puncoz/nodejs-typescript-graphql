import { hash } from "bcryptjs"
import * as yup from "yup"
import { User } from "../../entity/User"
import { ResolverMap } from "../../types/graphql-utils"
import { createConfirmEmailLink } from "../../utils/createConfirmEmailLink"
import { formatYupErrors } from "../../utils/formatYupErrors"
import { sendEmail } from "../../utils/sendEmail"
import { duplicateEmail, emailNotLongEnough, invalidEmail, passwordNotLongEnough } from "./errorMessages"

const schema = yup.object({
    email: yup.string().min(6, emailNotLongEnough).max(255).email(invalidEmail),
    password: yup.string().min(6, passwordNotLongEnough).max(50)
})

export const resolvers: ResolverMap = {
    Mutation: {
        register: async (_, args: GQL.IRegisterOnMutationArguments, {redis, url}) => {
            try {
                await schema.validate(args, {abortEarly: false})
            } catch (e) {
                return formatYupErrors(e)
            }

            const {email, password} = args
            const userAlreadyExists = await User.findOne({where: {email}, select: ["id"]})
            if (userAlreadyExists) {
                return [
                    {
                        path: "email",
                        message: duplicateEmail
                    }
                ]
            }

            const hashedPassword = await hash(password, 10)
            const user = User.create({
                email,
                password: hashedPassword
            })

            await user.save()

            const link = await createConfirmEmailLink(url, user.id, redis)
            if (process.env.NODE_ENV !== "test") {
                await sendEmail(email, link)
            }

            return null
        }
    }
}
