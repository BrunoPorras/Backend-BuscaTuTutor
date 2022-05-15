const express = require('express')
const cors = require('cors')
const app = express()
require('dotenv').config()

//  Rutas importadas para usar en la api
const user = require('./routes/usuarios')
const tutor = require('./routes/tutores')
const estudiante = require('./routes/estudiantes')

//  Puerto de escucha de la api
const port = process.env.PORT || 3000

//  Middleware
app.use(cors())
app.use(express.json())

//  Rutas de la api
app.use('/api', user)
app.use('/api', tutor)
app.use('/api', estudiante)

//  Escuchar al puerto y confirmar
app.listen(port, () => {
    console.log(` Escuchando el puerto: ${port}`)
})

module.exports = app