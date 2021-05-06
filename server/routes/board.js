const router = require('express').Router()
const Board = require('../models/Board')
const Task = require('../models/Task')

router
  .use('/boards', router)
  /**
   * @method post
   * @route api/boards/
   * @purpose gathers all boards according to given user _id.
   * will only return boards that private if given user _id is
   * the same as the user viewing the boards
   * @returns array of board objects with tasks populated
   */
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

  /**
   * @method put
   * @route api/boards/
   * @purpose updates entire board based of the properties
   * given with the required req.body.update object
   * @returns the updated board
   */
  .put('/', (req, res, next) => {
    // returns an array of task ids instead of the entire task
    if (req.body.update.tasks)
      req.body.update.tasks = req.body.update.tasks.map((t) =>
        t._id ? t._id : t
      )
    Board.findById(req.body.update.board, async (err, board) => {
      if (err || !board) return err ? next(err) : next('No board found')
      // iterate over all the properties/entries on update object
      await Object.entries(req.body.update).map(
        ([key, value]) => (board[key] = value)
      )
      board.save().then((board) => {
        if (err) return next(err)
        res.status(200).json(board)
      })
    }).catch((err) => next(err))
  })

  /**
   * @method get
   * @route api/boards/reported
   * @purpose gathers all the reported task for currently signed user.
   * requires no paramaters
   * @future could gather all reported tasks for a given _id/user, but
   * default to currently signed in user if _id paramater was not given
   * @returns gathered reported task for currently signed in user
   */
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
