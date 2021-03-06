import { Connection } from "typeorm"
import { User } from "../../entity/User"
import { createTypeOrmConnection } from "../../utils/createTypeOrmConnection"
import { TestClientService } from "../../utils/testClientService"
import { invalidLogin, notVerified } from "./errorMessages"

const getHost = (): string => process.env.TEST_HOST as string

let dbConnection: Connection
const testEmail = "login@test.com"
const testPassword = "secret"
const client: TestClientService = new TestClientService(getHost())

const expectFailedLogin = async (email: string, password: string, errorMessage: string) => {
    const response = await client.login(email, password)
    expect(response).toEqual({
        login: [
            {
                path: "email",
                message: errorMessage
            }
        ]
    })
}

beforeAll(async () => {
    dbConnection = await createTypeOrmConnection()

    await client.register(testEmail, testPassword)
})

afterAll(async () => {
    await dbConnection.close()
})

describe("User Login", () => {
    it("should failed for invalid email", async () => {
        await expectFailedLogin("test", testPassword, invalidLogin)
    })

    it("should failed for invalid password", async () => {
        await expectFailedLogin(testEmail, "123", invalidLogin)
    })

    it("should failed for not verified user", async () => {
        await expectFailedLogin(testEmail, testPassword, notVerified)
    })

    it("should success for verified user", async () => {
        await User.update({email: testEmail}, {verified: true})

        const response = await client.login(testEmail, testPassword)
        expect(response).toEqual({login: null})
    })
})
