import { startServer } from "../startServer"

export default async () => {
    if (!process.env.TEST_HOST) {
        await startServer(({port}: any) => {
            process.env.TEST_HOST = `http://localhost:${port}`
        })
    }
}
