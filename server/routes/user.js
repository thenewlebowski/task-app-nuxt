const router = require('express').Router()
const User = require('../models/User')

router
  .use('/users', router)
  .get('/', function(req, res, next) {
    User.find(function(err, users) {
      if (err) return next(err)
      res.json(users)
    })
  })
  .get('/:id', function(req, res, next) {
    User.findById(req.params.id, function(err, user) {
      if (err) return next(err)
      res.json(user)
    })
  })
  // register
  .post('/', function(req, res, next) {
    User.create(req.body, function(err, user) {
      if (err) return next(err)
      res.json(user)
    })
  })
  .put('/', function(req, res, next) {
    User.findByIdAndUpdate(
      req.session.user._id,
      req.body,
      { new: true },
      function(err, user) {
        if (err) return next(err)
        // set session to updated user
        req.session.user = user
        res.json(user)
      }
    )
  })
  .delete('/:id', function(req, res, next) {
    User.findByIdAndRemove(req.params.id, req.body, function(err, user) {
      if (err) return next(err)
      res.json(user)
    })
  })

module.exports.router = router
