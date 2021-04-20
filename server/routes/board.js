const router = require('express').Router()
const Board = require('../models/Board')

router
  .use('/boards', router)
  // returns all boards
  .post('/', (req, res, next) => {
    const _id = req.body._id
    const query = {
      owner: _id
    }

    if (_id.toString() !== req.session.user._id.toString()) {
      query.publicBoard = true
    }

    Board.find(query)
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
  .post('/create', (req, res, next) => {
    Board.create(req.body, (err, board) => {
      if (err) return next(err)
      return res.status(200).json(board)
    })
  })

module.exports.router = router
