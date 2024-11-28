const { Router } = require('express')

const router = Router()

//la variable con los metodos de ruteo
const contactosRoutes = require('./contactos.routes')

//crear las rutas web

router.use('/api/contacto', contactosRoutes)

module.exports = router