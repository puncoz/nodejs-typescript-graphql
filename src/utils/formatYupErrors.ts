import { ValidationError } from "yup"

export const formatYupErrors = (errors: ValidationError) => {
    const errorResponse: Array<{ path: string, message: string }> = []

    errors.inner.forEach(error => {
        errorResponse.push({
            path: error.path,
            message: error.message
        })
    })

    return errorResponse
}
