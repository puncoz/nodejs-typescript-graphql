import { request } from "graphql-request"
import { Connection } from "typeorm"
import { User } from "../../entity/User"
import { createTypeOrmConnection } from "../../utils/createTypeOrmConnection"
import { duplicateEmail, emailNotLongEnough, invalidEmail, passwordNotLongEnough } from "./errorMessages"

const getHost = (): string => process.env.TEST_HOST as string

let dbConnection: Connection
const testEmail = "hello@world.com"
const testPassword = "secret"

const mutation = (email: string, password: string) => `
mutation {
    register(email: "${email}", password: "${password}") {
        path
        message
    }
}
`

beforeAll(async () => {
    dbConnection = await createTypeOrmConnection()
})

afterAll(async () => {
    await dbConnection.close()
})

describe("User Registration", () => {
    test("Invalid Email", async () => {
        const response = await request(getHost(), mutation("test", testPassword))
        expect(response).toEqual({
            register: [
                {
                    path: "email",
                    message: emailNotLongEnough
                },
                {
                    path: "email",
                    message: invalidEmail
                }
            ]
        })
    })

    test("Invalid Password", async () => {
        const response = await request(getHost(), mutation(testEmail, "123"))
        expect(response).toEqual({
            register: [
                {
                    path: "password",
                    message: passwordNotLongEnough
                }
            ]
        })
    })

    test("Invalid Email and Password", async () => {
        const response = await request(getHost(), mutation("test", "123"))
        expect(response).toEqual({
            register: [
                {
                    path: "email",
                    message: emailNotLongEnough
                },
                {
                    path: "email",
                    message: invalidEmail
                },
                {
                    path: "password",
                    message: passwordNotLongEnough
                }
            ]
        })
    })

    test("Registration success", async () => {
        const successResponse = await request(getHost(), mutation(testEmail, testPassword))
        expect(successResponse).toEqual({register: null})

        const users = await User.find({where: {email: testEmail}})
        expect(users).toHaveLength(1)

        const user = users[0]
        expect(user.email).toEqual(testEmail)
        expect(user.password).not.toEqual(testPassword)
    })

    test("Duplicate Email", async () => {
        const response = await request(getHost(), mutation(testEmail, testPassword))
        expect(response.register).toHaveLength(1)
        expect(response.register[0]).toEqual({
            path: "email",
            message: duplicateEmail
        })
    })
})
