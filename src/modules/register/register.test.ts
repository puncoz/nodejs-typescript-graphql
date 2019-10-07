import { request } from "graphql-request"
import { Server } from "http"
import { User } from "../../entity/User"
import { startServer } from "../../startServer"

let getHost = () => ""
let server: Server

beforeAll(async () => {
    server = await startServer(({port}: any) => {
        getHost = () => `http://localhost:${port}`
    })
})

afterAll(async () => {
    server.close()
})

const email = "hello@world.com"
const password = "secret"

const mutation = `
mutation {
    register(email: "${email}", password: "${password}") {
        path
        message
    }
}
`

test("Register user", async (done) => {
    const successResponse = await request(getHost(), mutation)
    expect(successResponse).toEqual({register: null})

    const users = await User.find({where: {email}})
    expect(users).toHaveLength(1)

    const user = users[0]
    expect(user.email).toEqual(email)
    expect(user.password).not.toEqual(password)

    const failedResponse = await request(getHost(), mutation)
    expect(failedResponse.register).toHaveLength(1)
    expect(failedResponse.register[0].path).toEqual("email")

    done()
})
