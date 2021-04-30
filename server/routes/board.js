const router = require('express').Router()
const Board = require('../models/Board')
const Task = require('../models/Task')

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
        path: 'tasks'
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
  //update tasks this can be modified to update any aspect of the board.
  .put('/', (req, res, next) => {
    req.body.tasks = req.body.tasks.map(t => t._id ? t._id : t)
    Board.findById(req.body.board, (err, board) => {
      if(err || !board) return err ? next(err) : next('No board found')
      board.tasks = req.body.tasks
      board.save()
      .then((board) => {
          if(err) return next(err)
          res.status(200).json(board)
        })
      })
      .catch((err) => next(err))
    })
  .get('/reported', async (req, res, next) => {
    const { _id } = req.session.user
    const boards = {}
    await Task.find(
      { reporter: _id, archived: false, assignee: { $ne: _id } },
      (err, tasks) => {
        if (err) return next(err)
        tasks.map((task) => {
          if (boards[task.assignee])
            boards[task.assignee].tasks = [task, ...boards[task.assignee].tasks]
          else
            boards[task.assignee] = new Board({
              index: Object.values(boards).length,
              title: task.assignee,
              _id: task.assignee,
              tasks: [task]
            })
        })
      }
    )
    res.status(200).json(Object.values(boards))
  })

module.exports.router = router
