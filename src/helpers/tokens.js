const jwt = require('jsonwebtoken')

const generateToken = (data) => {
    const token = jwt.sign(
        {
            nombre: data.nombre,
            correo: data.correo,
            es_tutor: data.es_tutor
        }, process.env.JWT_KEY,
        {
            expiresIn: "6h"
        }
    )
    return token
}

const validateToken = (token) => {
    try {
        const result = jwt.verify(token, process.env.JWT_KEY)
        return result
    } catch (e) {
        return null
    }
}

module.exports = { generateToken, validateToken }