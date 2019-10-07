import * as SparkPost from "sparkpost"

const client = new SparkPost(process.env.SPARKPOST_API_KEY)

export const sendEmail = async (recipient: string, confirmationUrl: string) => {
    const response = await client.transmissions.send({
        options: {
            sandbox: true
        },
        content: {
            from: "testing@sparkpostbox.com",
            subject: "Confirmation email",
            html: `
                <html lang="en">
                    <body>
                        <p>You have registered with your email.</p>
                        <a href="${confirmationUrl}">Confirm</a>
                    </body>
                </html>
            `
        },
        recipients: [
            {address: recipient}
        ]
    })

    console.log(response)
}
