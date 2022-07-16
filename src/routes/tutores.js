const { Router } = require('express')
const router = Router()
const tutoresCtrl = require('../controllers/tutores.controller')

//  Obtener todos los tutores
router.get('/getTutores', tutoresCtrl.getAllTutores)

//  Obtener un tutor
router.get('/getTutor', tutoresCtrl.getOneTutorFromStudent)

//  Desactivar cuenta de tutor
router.put('/unableTutor', tutoresCtrl.leaveTutor)

//  Reactivar cuenta de tutor
router.put('/enableTutor', tutoresCtrl.activeAccount)

//  Filtrar tutores por especialidad o habilidadese
router.get('/filterTutor',tutoresCtrl.filterBy)

module.exports = router