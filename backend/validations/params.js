const paramID = {
    id: {
        in: ['params'],
        isInt: {
            errorMessage: "L'ID deve essere un numero"
        },
        toInt: true
    },
}

module.exports = {
    paramID
}