const { Router } = require('express')
const router = Router()
const userCtrl = require('../controllers/usuarios.controller')

//  Obtener usuario
router.get('/getOne', userCtrl.getOneUser)

//  Obtener todos los usuarios
router.get('/getAll', userCtrl.getAllUsers)

//  Crear usuario
router.post('/create', userCtrl.createUser)

//  Modificar usuario
router.put('/update', userCtrl.updateUser)

//  Eliminar usuario
router.delete('/delete', userCtrl.deleteUser)

//  Login
router.post('/login', userCtrl.loginUser)

module.exports = router