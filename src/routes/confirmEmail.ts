import { Request, Response } from "express"
import { User } from "../entity/User"
import { redis } from "../redis"

export const confirmEmail = async (req: Request, res: Response) => {
    const {token} = req.params
    const userId: any = await redis.get(token)
    if (userId) {
        await User.update({id: userId}, {verified: true})
        await redis.del(token)
        res.send("ok")
    } else {
        res.send("invalid")
    }
}
