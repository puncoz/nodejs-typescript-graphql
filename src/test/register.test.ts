import { request } from "graphql-request"
import { User } from "../entity/User"
import { createTypeOrmConnection } from "../utils/createTypeOrmConnection"
import { host } from "./constants"

beforeAll(async () => {
    await createTypeOrmConnection()
})

const email = "hello@world.com"
const password = "secret"

const mutation = `
mutation {
    register(email: "${email}", password: "${password}")
}
`

test("Register user", async (done) => {
    const response = await request(host, mutation)
    expect(response).toEqual({register: true})
    done()

    const users = await User.find({where: {email}})
    expect(users).toHaveLength(1)

    const user = users[0]
    expect(user.email).toEqual(email)
    expect(user.password).not.toEqual(password)

    done()
})
