const router = require('express').Router()
// const validateToken = require('../middleware/validate-token')

router.use('/auth', require('./auth').router)
router.use('/users', require('./user').router)
router.use('/tasks', require('./task').router)
router.use('/departments', require('./departments').router)
router.use('/boards', require('./board').router)

module.exports.router = router
