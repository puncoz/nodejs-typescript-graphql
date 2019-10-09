import axios from "axios"
import { Connection } from "typeorm"
import { User } from "../../entity/User"
import { createTypeOrmConnection } from "../../utils/createTypeOrmConnection"

let dbConnection: Connection
const testEmail = "my-profile@test.com"
const testPassword = "secret"
let user: User

const http = axios.create({
    withCredentials: true
})

const getHost = (): string => process.env.TEST_HOST as string

const registerMutation = (email: string, password: string) => `
mutation {
    register(email: "${email}", password: "${password}") {
        path
        message
    }
}
`

const loginMutation = (email: string, password: string) => `
mutation {
    login(email: "${email}", password: "${password}") {
        path
        message
    }
}
`

const myProfileQuery = () => `
{
    me {
        id
        email
    }
}
`

const logoutMutation = () => `
mutation {
    logout
}
`

const login = async (email: string, password: string) => {
    return http.post(getHost(), {
        query: loginMutation(email, password)
    }, {
        withCredentials: true
    })
}

const logout = async () => {
    return http.post(getHost(), {
        query: logoutMutation()
    }, {
        withCredentials: true
    })
}

const getProfile = async () => {
    return http.post(getHost(), {
        query: myProfileQuery()
    }, {
        withCredentials: true
    })
}

const expectProfile = async (expected?: object) => {
    const response = await getProfile()
    expect(response.data.data).toEqual(expected)
}

beforeAll(async () => {
    dbConnection = await createTypeOrmConnection()

    await http.post(getHost(), {
        query: registerMutation(testEmail, testPassword)
    })

    user = await User.findOne({where: {email: testEmail}}) as User
    await User.update({id: user.id}, {verified: true})
    console.log("started")
})

afterAll(async () => {
    await dbConnection.close()
})

describe("Logout", () => {
    it("should clear session", async (done) => {
        await login(testEmail, testPassword)
        await expectProfile({
            me: {
                id: user.id,
                email: user.email
            }
        })

        await logout()
        await expectProfile({
            me: null
        })

        done()
    })
})
