const { Router } = require('express')
const router = Router()
const estudiantesCtrl = require('../controllers/estudiantes.controller')

//  Registrar tutor
router.post('/registrarTutor', estudiantesCtrl.registrarTutor)

//  Obtener solo estudiantes
router.get('/getStudents', estudiantesCtrl.getOnlyStudents)

//  Añadir a favoritos a un tutor
router.post('/registrarTutorFav', estudiantesCtrl.addFavTutor)

//  Ver los tutores favoritos de un estudiante
router.get('/getFavTutors', estudiantesCtrl.getFavTutors)

//  Eliminar de favoritos a un tutor
router.delete('/deleteFavTutor', estudiantesCtrl.deleteFavTutor)

module.exports = router