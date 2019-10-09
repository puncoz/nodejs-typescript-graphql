import { Connection } from "typeorm"
import { User } from "../../entity/User"
import { createTypeOrmConnection } from "../../utils/createTypeOrmConnection"
import { TestClientService } from "../../utils/testClientService"

const getHost = (): string => process.env.TEST_HOST as string

let dbConnection: Connection
const testEmail = "my-profile@test.com"
const testPassword = "secret"
let user: User

const client: TestClientService = new TestClientService(getHost())

beforeAll(async () => {
    dbConnection = await createTypeOrmConnection()

    await client.register(testEmail, testPassword)

    user = await User.findOne({where: {email: testEmail}}) as User
    await User.update({id: user.id}, {verified: true})
})

afterAll(async () => {
    await dbConnection.close()
})

describe("User Profile", () => {
    it("should be null for not logged-in user", async () => {
        const response = await client.myProfile()
        expect(response.me).toBeNull()
    })

    it("should get profile for logged-in user", async () => {
        await client.login(testEmail, testPassword)

        const response = await client.myProfile()
        expect(response).toEqual({
            me: {
                id: user.id,
                email: user.email
            }
        })
    })
})
