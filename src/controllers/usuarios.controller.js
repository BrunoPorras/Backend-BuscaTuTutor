//  ORM para la base de datos
const { PrismaClient, Prisma } = require('@prisma/client')
const prisma = new PrismaClient()

//  Manejador de errores con el ORM
const handleErrorPrisma = require('../handlers/handleErrorPrisma')

//  JsonWebToken
const jwt = require('jsonwebtoken')

//  Objeto con los métodos de los controladores
const userCtrl = {}

//  Obtener un estudiante - CHECK
userCtrl.getOneUser = async (req, res) => {
    //  Id del estudiante
    const idUser = req.query.idUser
    
    try {
        //  Query
        const Usuario = await prisma.estudiante.findUnique({
            where: {
                id: Number(idUser)
            },
            select: {
                id: true,
                nombre: true,
                correo: true,
                password: true,      //  QUITAR AL DESPLEGAR APP
                num_telf: true,
                es_tutor: true
            }
        })
        //  Mensaje a retornar
        let Message = Usuario == null ? "No exist" : "Success"
        res.json({ Message, Usuario })
    } catch (e) {
        res.json(handleErrorPrisma(e))
    }
}

//  Obtener todos los estudiante - CHECK - Mientras exista la tabla de estudiante OK
userCtrl.getAllUsers = async (req, res) => {
    //  Query
    const result = await prisma.estudiante.findMany()
    res.json(result)
}

//  Crear estudiante - CHECK
userCtrl.createUser = async (req, res) => {
    try {
        //  Data de ingreso
        const {
            correo,
            password,
            nombre,
            num_telf
        } = req.body
    
        //  Query
        const Usuario = await prisma.estudiante.create({
            data: {
                correo,
                password,
                nombre,
                num_telf: String(num_telf),
                es_tutor: false
            },
            select: {
                id: true,
                nombre: true,
                correo: true,
                num_telf: true,
                es_tutor: true
            }
        })
        //  Mensaje a retornar
        let Message = Usuario == null ? "Fail" : "Success"
        res.json({ Message, Usuario })
    } catch (e) {
        res.json(handleErrorPrisma(e))
    }
}

//  Actualizar estudiante - CHECK
userCtrl.updateUser = async (req, res) => {
    try {
        //  Id de la persona
        const idUser = req.query.idUser
    
        //  Data a actualizar
        const {
            correo,
            password,
            nombre,
            num_telf,
            es_tutor
        } = req.body
    
        //  Query
        const result = await prisma.estudiante.update({
            where: {
                id: Number(idUser)
            },
            data: {
                correo,
                password,
                nombre,
                num_telf: String(num_telf),
                es_tutor
            },
            select: {
                id: true,
                nombre: true,
                correo: true,
                num_telf: true,
                es_tutor: true
            }
        })
        //  Mensaje a retornar
        let Message = result == null ? "Fail" : "Success"
        res.json({ Message, result })
    } catch (e) {
        res.json(handleErrorPrisma(e))
    }
}

//  Eliminar un usuario - CHECK
userCtrl.deleteUser = async (req, res) => {
    try{
        //  Id de la persona
        const idUser = req.query.idUser
    
        //  Query
        const result = await prisma.estudiante.delete({
            where: {
                id: Number(idUser)
            },
            select: {
                id: true,
                nombre: true,
                correo: true,
                num_telf: true,
                es_tutor: true
            }
        })
        //  Mensaje a retornar
        let Message = result == null ? "Fail" : "Success"
        res.json({ Message, result })
    } catch (e) {
        res.json(handleErrorPrisma(e))
    }
}

//  Login - CHECK
userCtrl.loginUser = async (req, res) => {
    try {
        //  Data del login
        const { correo, password } = req.body
    
        //  Query
        const result = await prisma.estudiante.findFirst({
            where: {
                correo: String(correo),
                password: String(password)
            },
            select: {
                id: true,
                correo: true,
                nombre: true,
                num_telf: true,
                es_tutor: true
            }
        })
        if(result){
            let token = jwt.sign(result, process.env.JWT_KEY, {
                expiresIn: "6h"
            })
            res.json({ Message: "Success", Estudiante: result, token })
        } else {
            res.json({ Message:"Fail" })
        }
    } catch (e) {
        res.json(handleErrorPrisma(e))
    }
}

module.exports = userCtrl