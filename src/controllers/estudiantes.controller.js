//  ORM para la base de datos
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

//  Manejador de errores con el ORM
const handleErrorPrisma = require('../handlers/handleErrorPrisma')

//  JsonWebToken
const jwt = require('jsonwebtoken')

//  Objeto con los métodos de los controladores
const estudianteCtrl = {}

//  Registrar estudiante como tutor - CHECK
estudianteCtrl.registrarTutor = async (req, res) => {
    try {
        //  Data del tutor a registrar
        const {
            descripcion,
            foto,
            habilidades,
            especialidades
        } = req.body
    
        //  Token recibido
        const token = req.header('Authorization')
    
        //  Validar token
        jwt.verify(token, process.env.JWT_KEY, async (error, user) => {
            if(!error){
                //  Validar que no sea un tutor
                if(user.es_tutor == false) {
                    //  Id del usuario
                    const idUser = user.id

                    //  Query para actualizar el estado del estudiante a tutor
                    const estudiante = await prisma.estudiante.update({
                        where: {
                            id: Number(idUser)
                        },
                        data: {
                            es_tutor: true,
                            tutor: {
                                create: {
                                    descripcion: String(descripcion),
                                    foto: String(foto),
                                    habilidades: {
                                        create: habilidades
                                    },
                                    especialidades: {
                                        create: especialidades
                                    }
                                }
                            }
                        },
                        include: {
                            tutor: {
                                include: {
                                    habilidades: {
                                        select: {
                                            id: true,
                                            desc_esp: true
                                        }
                                    },
                                    especialidades: {
                                        select: {
                                            id: true,
                                            desc_esp: true
                                        }
                                    }
                                }
                            }
                        }
                    })
                    res.json({ message: "Success", estudiante })
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

//  Obtener solo los estudiantes - CHECK
estudianteCtrl.getOnlyStudents = async (req, res) => {
    try {
        //  Query para obtener solo estudiantes
        const Estudiantes = await prisma.estudiante.findMany({
            where: {
                es_tutor: false
            },
            select: {
                id: true,
                nombre: true,
                correo: true,
                num_telf: true
            }
        })
        res.json(Estudiantes)
    } catch (e) {
        res.json(handleErrorPrisma(e))
    }
}

//  Poner a un tutor en favoritos - CHECK
estudianteCtrl.addFavTutor = async (req, res) => {
    try {
        //  Token
        const token = req.header('Authorization')
    
        //  Data del tutor a añadir
        const {
            idTutor
        } = req.body
    
        //  Validar token
        jwt.verify(token, process.env.JWT_KEY, async (error, user) => {
            if(!error){
                //  Validar que no sea un tutor
                //if(user.es_tutor == false){
                    //  Id del usuario
                    const idUser = user.id

                    //  Query para validar si el id enviado es de un tutor
                    const es_tutor = await prisma.tutor.count({
                        where: {
                            id: idTutor
                        }
                    })

                    //  Si es que existe el tutor
                    if(es_tutor == 1) {
                        //  Query para validar de que no sea favorito
                        const no_fav = await prisma.favoritos.count({
                            where: {
                                id_estud: Number(idUser),
                                id_tutor: Number(idTutor)
                            }
                        })
    
                        //  Si el tutor no está registrado en favoritos
                        if(no_fav == 0) {
                            //  Query para registrar al tutor favorito
                            await prisma.favoritos.create({
                                data: {
                                    id_estud: Number(idUser),
                                    id_tutor: Number(idTutor)
                                }
                            })
                            res.json({ message: "Success", detail: "Tutor añadido a favoritos" })
                        } else {
                            res.json({ message: "Fail", detail: "Este tutor ya está en su lista de favoritos" })
                        }
                    } else {
                        res.json({ message: "Fail", detail: "El tutor no existe" })
                    }        
                //} else {
                    //res.json({ message: "Fail", detail: "Solo los alumnos acceden a esta función" })
                //}
            } else {
                res.json({ message: "Fail", detail: "Token incorrecto o expirado" })
            }
        })
    } catch (e) {
        res.json(handleErrorPrisma(e))
    }
}

//  Obtener los tutores favoritos de un estudiante - CHECK
estudianteCtrl.getFavTutors = (req, res) => {
    try {
        //  Token
        const token = req.header('Authorization')
    
        //  Validar token
        jwt.verify(token, process.env.JWT_KEY, async (error, user) => {
            if(!error){
                //  Validar que no sea un tutor
                if(user.es_tutor == false){
                    //  Id del usuario
                    const idUser = user.id
        
                    //  Query para obteneer los tutores favoritos
                    const tutores_favoritos = await prisma.favoritos.findMany({
                        where: {
                            id_estud: Number(idUser)
                        },
                        select: {
                            id: true,
                            tutor: {
                                select: {
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
                                    },
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
                    res.json(tutores_favoritos)
                } else {
                    res.json({ message: "Fail", detail: "Solo los alumnos acceden a esta función" })
                }
            } else {
                res.json({ message: "Fail", detail: "Token incorrecto o expirado" })
            }
        })
    } catch (e) {
        res.json(handleErrorPrisma(e))
    }
}

//  Eliminar un tutor de favoritos - CHECK
estudianteCtrl.deleteFavTutor = (req, res) => {
    try {
        //  Token
        const token = req.header('Authorization')
    
        //  Validar token
        jwt.verify(token, process.env.JWT_KEY, async (error, user) => {
            if(!error){
                //  Validar que no sea un tutor
                if(user.es_tutor == false){
    
                    //  Id del usuario
                    const idUser = user.id
                    
                    //  Id del tutor a eliminar
                    const { idTutor } = req.body
    
                    //  Query para eliminar tutor
                    const query = await prisma.favoritos.deleteMany({
                        where: {
                            id_estud: Number(idUser),
                            id_tutor: Number(idTutor)
                        }
                    })
                    if(query.count == 1){
                        res.json({ message: "Success", detail: "Tutor eliminado de favoritos" })
                    } else {
                        res.json({ message: "Fail", detail: "Tutor no encontrado en favoritos" })
                    }
                } else {
                    res.json({ message: "Fail", detail: "Solo los alumnos acceden a esta función" })
                }
            } else {
                res.json({ message: "Fail", detail: "Token incorrecto o expirado" })
            }
        })
    } catch (e) {
        res.json(handleErrorPrisma(e))
    }
}

module.exports = estudianteCtrl