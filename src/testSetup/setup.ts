import { startServer } from "../startServer"

export default async () => {
    await startServer(({port}: any) => {
        process.env.TEST_HOST = `http://localhost:${port}`
    })
}
