const bcrypt = require('bcryptjs')

const generatePass = (text) => {
    const salt = bcrypt.genSaltSync(10)
    const hash = bcrypt.hashSync(text, salt)
    return hash
}

const comparePass = (send_pass, real_pass) =>{
    const result = bcrypt.compareSync(send_pass, real_pass)
    return result
}

module.exports = { generatePass, comparePass }