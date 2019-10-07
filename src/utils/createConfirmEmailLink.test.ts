import * as Redis from "ioredis"
import fetch from "node-fetch"
import { Connection } from "typeorm"
import { User } from "../entity/User"
import { createConfirmEmailLink } from "./createConfirmEmailLink"
import { createTypeOrmConnection } from "./createTypeOrmConnection"

let userId: string
let dbConnection: Connection
const redis = new Redis()

beforeAll(async () => {
    dbConnection = await createTypeOrmConnection()

    const user = await User.create({
        email: "test-confirm-link@test.com",
        password: "secret"
    }).save()

    userId = user.id
})

afterAll(async () => {
    await dbConnection.close()
})

describe("Test createConfirmEmailLink", () => {
    it("should verify user with valid confirmation link and clear token from redis after success.", async () => {
        const confirmUrl = await createConfirmEmailLink(process.env.TEST_HOST as string, userId, redis)

        const response = await fetch(confirmUrl)
        const responseText = await response.text()
        expect(responseText).toEqual("ok")

        const user = await User.findOne({where: {id: userId}})
        expect((user as User).verified).toBeTruthy()

        const urlChunks = confirmUrl.split("/")
        const token = urlChunks[urlChunks.length - 1]
        const tokenInRedis = await redis.get(token)
        expect(tokenInRedis).toBeNull()
    })

    it("should returns invalid response upon bad token in confirmation url", async () => {
        const invalidConfirmUrl = `${process.env.TEST_HOST}/confirm/1232123`
        const response = await fetch(invalidConfirmUrl)
        const responseText = await response.text()
        expect(responseText).toEqual("invalid")
    })
})
