import fetch from "node-fetch"

it("should returns invalid response upon bad token in confirmation url", async () => {
    const invalidConfirmUrl = `${process.env.TEST_HOST}/confirm/1232123`
    const response = await fetch(invalidConfirmUrl)
    const responseText = await response.text()
    expect(responseText).toEqual("invalid")
})
