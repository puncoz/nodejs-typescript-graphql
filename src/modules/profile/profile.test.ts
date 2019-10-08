import axios from "axios"
import { Connection } from "typeorm"
import { User } from "../../entity/User"
import { createTypeOrmConnection } from "../../utils/createTypeOrmConnection"

let dbConnection: Connection
const testEmail = "my-profile@test.com"
const testPassword = "secret"
let user: User

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

const login = async (email: string, password: string) => {
    return axios.post(getHost(), {
        query: loginMutation(email, password)
    }, {
        withCredentials: true
    })
}

const getProfile = async () => {
    return axios.post(getHost(), {
        query: myProfileQuery()
    }, {
        withCredentials: true
    })
}

beforeAll(async () => {
    dbConnection = await createTypeOrmConnection()

    await axios.post(getHost(), {
        query: registerMutation(testEmail, testPassword)
    }, {
        withCredentials: true
    })

    user = await User.findOne({where: {email: testEmail}}) as User
    await User.update({id: user.id}, {verified: true})
})

afterAll(async () => {
    await dbConnection.close()
})

describe("User Profile", () => {
    // it("should not get my profile if not logged-in", async (done) => {
    //     done()
    // })

    it("should get profile for logged-in user", async () => {
        await login(user.email, testPassword)

        const response = await getProfile()
        expect(response.data.data).toEqual({
            me: {
                id: user.id,
                email: user.email
            }
        })
    })
})
