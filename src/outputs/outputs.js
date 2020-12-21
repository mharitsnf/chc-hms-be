const errorOutputs = (code, error, reply) => {
    reply.code(code)
    return {
        statusCode: code,
        message: error.message ? error.message : 'No message provided',
        details: error
    }
}

const successOutputs = (data) => {
    return {
        statusCode: 200,
        message: "Successful",
        data: data
    }
}

exports.errorOutputs = errorOutputs
exports.successOutputs = successOutputs