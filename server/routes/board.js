const router = require('express').Router()
const Board = require('../models/Board')

router
  .use('/boards', router)
  // returns all boards
  .get('/', (req, res, next) => {
    const { _id } = req.session.user
    Board.find({ owner: _id })
      .populate({
        path: 'tasks',
        options: {
          sort: {
            index: 1
          }
        }
      })
      .exec(async (err, boards) => {
        if (err) return next(err)
        await boards.sort((a, b) => a.index - b.index)
        return res.status(200).json(boards)
      })
  })
  .post('/', (req, res, next) => {
    Board.create(req.body, (err, board) => {
      if (err) return next(err)
      return res.status(200).json(board)
    })
  })

module.exports.router = router
