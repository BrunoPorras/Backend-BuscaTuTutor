//  ORM para la base de datos
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

//  Manejador de errores con el ORM
const handleErrorPrisma = require('../handlers/handleErrorPrisma')

//  JsonWebToken
const jwt = require('jsonwebtoken')

//  Objeto con los métodos de los controladores
const tutoresCtrl = {}

//  Obtener la lista de tutores completa - CHECK
tutoresCtrl.getAllTutores = async (req, res) => {
    try {
        //  Query para obtener datos de los tutores
        const tutores_info = await prisma.estudiante.findMany({
            where: {
                es_tutor: true
            },
            select: {
                id: true,
                nombre: true,
                num_telf: true,
                correo: true,
                tutor: {
                    select: {
                        id: true,
                        descripcion: true,
                        foto: true,
                        habilidades: {
                            select: {
                                desc_esp: true
                            }
                        },
                        especialidades: {
                            select: {
                                desc_esp: true
                            }
                        }
                    }
                }
            }
        })
        res.json(tutores_info)
    } catch (e) {
        res.json(handleErrorPrisma(e))
    }
}

//  Obtener un tutor únicamente - CHECK
tutoresCtrl.getOneTutor = async (req, res) => {
    try {
        //  Id del tutor
        const id = req.query.id

        //  Query para obtener al tutor
        const tutor = await prisma.tutor.findUnique({
            where: {
                id_estud: Number(id)
            },
            select: {
                id: true,
                descripcion: true,
                foto: true,
                estudiante: {
                    select: {
                        id: true,
                        nombre: true,
                        num_telf: true,
                        correo: true
                    }
                },
                habilidades: {
                    select: {
                        desc_esp: true
                    }
                },
                especialidades: {
                    select: {
                        desc_esp: true
                    }
                }
            }
        })
        res.json(tutor)
    } catch (e) {
        res.json(handleErrorPrisma(e))
    }
}

//  Dejar de ser tutor
tutoresCtrl.leaveTutor = async (req, res) => {
    try {
        //  Token recibido
        const token = req.header('Authorization')

        //  Validar token
        jwt.verify(token, process.env.JWT_KEY, async (error, user) => {
            if(!error){
                //  Id del usuario
                const idUser = user.id

                //  Obtener los datos del usuario
                const usuario = await prisma.estudiante.findUnique({
                    where: {
                        id: idUser
                    }
                })
                
                //  Validar que sea un tutor
                if(usuario.es_tutor == true) {

                    //  Query para obtener el id de tutor
                    const tutor = await prisma.tutor.findUnique({
                        where: {
                            id_estud: idUser
                        }
                    })

                    //  Query para desactivar la cuenta al tutor
                    await prisma.estudiante.update({
                        where: {
                            id: Number(idUser)
                        },
                        data: {
                            es_tutor: false
                        }
                    })
                    
                    //  Query para eliminar los registros de favoritos del tutor
                    await prisma.favoritos.deleteMany({
                        where: {
                            id_tutor: tutor.id
                        }
                    })

                    res.json({ message: "Success" })
                } else {
                    res.json({ message: "Fail", detail: "No está registrado como tutor" })
                }
            } else {
                res.json({ message: "Fail", detail: "Token incorrecto o expirado" })
            }
        })
    } catch (e) {
        res.json(handleErrorPrisma(e))
    }
}

//  Reactivar cuenta de tutor
tutoresCtrl.activeAccount = async (req, res) => {
    try {
        //  Token recibido
        const token = req.header('Authorization')

        //  Validar token
        jwt.verify(token, process.env.JWT_KEY, async (error, user) => {
            if(!error){
                //  Id del usuario
                const idUser = user.id

                //  Obtener los datos del usuario
                const usuario = await prisma.estudiante.findUnique({
                    where: {
                        id: idUser
                    }
                })
                //  Validar que no sea un tutor
                if(usuario.es_tutor == false) {
                    //  Id del usuario
                    const idUser = user.id

                    //  Query para reactivar la cuenta del tutor
                    await prisma.estudiante.update({
                        where: {
                            id: idUser
                        },
                        data: {
                            es_tutor: true
                        }
                    })
                    res.json({ message: "Success" })
                } else {
                    res.json({ message: "Fail", detail: "Ya está registrado como tutor" })
                }
            } else {
                res.json({ message: "Fail", detail: "Token incorrecto o expirado" })
            }
        })
    } catch (e) {
        res.json(handleErrorPrisma(e))
    }
}

//  Filtrar tutores - Yo recomendaría hacerlo desde el front pero por si acaso hago el endpoint
tutoresCtrl.filterBy = async (req, res) => {
    try {
        //  Obtener el campo por el que se va a filtrar
        const filtro = req.query.filtro
        const campo = req.query.campo

        if (filtro == "Especialidad") {
            const result = await prisma.especialidadesTutor.findMany({
                where: {
                    desc_esp: campo
                },
                include: {
                    tutor: {
                        select: {
                            descripcion: true,
                            foto: true,
                            estudiante: {
                                select: {
                                    nombre: true,
                                    num_telf: true,
                                    correo: true
                                }
                            }
                        }
                    }
                }
            })
            res.json({ message: "Success", result })
        } else if (filtro == "Habilidad") {
            const result = await prisma.habilidadesTutor.findMany({
                where: {
                    desc_esp: campo
                },
                include: {
                    tutor: {
                        select: {
                            descripcion: true,
                            foto: true,
                            estudiante: {
                                select: {
                                    nombre: true,
                                    num_telf: true,
                                    correo: true
                                }
                            }
                        }
                    }
                }
            })
            res.json({ message: "Success", result })
        } else {
            res.json({ message: "Fail", detail: "No existe el tipo de filtro escogido" })
        }
    } catch (e) {
        res.json(handleErrorPrisma(e))
    }
}

module.exports = tutoresCtrl