const router = require('express').Router()
const Department = require('../models/Department')

router
  .use('/departments', router)
  // returns all departments
  .get('/', (req, res, next) => {
    Department.find({}, (err, departments) => {
      if (err) return next(err)
      return res.json(departments)
    })
  })
  .post('/', (req, res, next) => {
    Department.create(req.body, (err, department) => {
      if (err) return next(err)
      return res.json(department)
    })
  })
module.exports.router = router
