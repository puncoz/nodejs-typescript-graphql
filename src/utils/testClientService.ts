import * as rp from "request-promise"

export class TestClientService {
    private readonly url: string
    private readonly options: {
        withCredentials: boolean;
        json: boolean;
        jar: any
    }

    constructor(url: string) {
        this.url = url

        this.options = {
            json: true,
            jar: rp.jar(),
            withCredentials: true
        }
    }

    async register(email: string, password: string) {
        const {data} = await rp.post(this.url, {
            ...this.options,
            body: {
                query: `
                mutation {
                    register(email: "${email}", password: "${password}") {
                        path
                        message
                    }
                }
                `
            }
        })

        return data
    }

    async login(email: string, password: string) {
        const {data} = await rp.post(this.url, {
            ...this.options,
            body: {
                query: `
                mutation {
                    login(email: "${email}", password: "${password}") {
                        path
                        message
                    }
                }
                `
            }
        })

        return data
    }

    async logout() {
        const {data} = await rp.post(this.url, {
            ...this.options,
            body: {
                query: `
                mutation {
                    logout
                }
                `
            }
        })

        return data
    }

    async myProfile() {
        const {data} = await rp.post(this.url, {
            ...this.options,
            body: {
                query: `
                {
                    me {
                        id
                        email
                    }
                }
                `
            }
        })

        return data
    }
}
