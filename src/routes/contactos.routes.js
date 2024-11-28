const express = require('express')
const contactoController = require('../controller/contactoController')
const router = express.Router()

// Ruta para obtener todos los contactos
router.get('/', contactoController.getAllContactos)
router.post('/', contactoController.createContacto)
router.get('/:id', contactoController.getContactoById)
router.put('/:id', contactoController.updateContacto)
router.delete('/:id', contactoController.deteleContacto)

module.exports = router