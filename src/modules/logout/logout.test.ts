import { Connection } from "typeorm"
import { User } from "../../entity/User"
import { createTypeOrmConnection } from "../../utils/createTypeOrmConnection"
import { TestClientService } from "../../utils/testClientService"

const getHost = (): string => process.env.TEST_HOST as string

let dbConnection: Connection
const testEmail = "my-profile@test.com"
const testPassword = "secret"
let user: User

const expectProfile = async (client: TestClientService, expected?: object) => {
    const response = await client.myProfile()
    expect(response).toEqual(expected)
}

beforeAll(async () => {
    dbConnection = await createTypeOrmConnection()

    const client = new TestClientService(getHost())
    await client.register(testEmail, testPassword)

    user = await User.findOne({where: {email: testEmail}}) as User
    await User.update({id: user.id}, {verified: true})
})

afterAll(async () => {
    await dbConnection.close()
})

describe("Logout", () => {
    test("single session", async (done) => {
        const client1 = new TestClientService(getHost())
        const client2 = new TestClientService(getHost())

        await client1.login(testEmail, testPassword)
        await client2.login(testEmail, testPassword)
        await expectProfile(client1, {
            me: {
                id: user.id,
                email: user.email
            }
        })
        expect(await client1.myProfile()).toEqual(await client2.myProfile())

        await client1.logout()
        await expectProfile(client1, {
            me: null
        })
        expect(await client1.myProfile()).not.toEqual(await client2.myProfile())

        done()
    })


    test("multiple session", async (done) => {
        const client1 = new TestClientService(getHost())
        const client2 = new TestClientService(getHost())

        await client1.login(testEmail, testPassword)
        await client2.login(testEmail, testPassword)
        expect(await client1.myProfile()).toEqual(await client2.myProfile())

        await client1.logoutFromAll()
        expect(await client1.myProfile()).toEqual(await client2.myProfile())
        done()
    })
})
