const router = require('express').Router()
const nodemailer = require('nodemailer')
const SPT = require('nodemailer-sparkpost-transport')
const Task = require('../models/Task')
const User = require('../models/User')
const upload = require('../middleware/upload')
const csvCont = require('../controllers/tasks/csv.controller')
const Board = require('../models/Board')
const transporter = nodemailer.createTransport(
  SPT({
    sparkPostApiKey: process.env.SPARKPOST_API_KEY
  })
)

const sendMail = (to, message) => {
  transporter.sendMail(
    {
      from: `"${process.env.MAIL_FROM_NAME}" <${process.env.MAIL_FROM_ADDRESS}>`,
      to,
      subject: 'Gogrello Notification',
      html: message
    },
    (err, info) => {
      if (err) {
        // eslint-disable-next-line no-console
        console.error(err)
      } else {
        // eslint-disable-next-line no-console
        console.log(info)
      }
    }
  )
}

const SITE_MANAGERS = {
  PlumbersStock: process.env.PSTOCK_MANAGER,
  'Adams&Co': process.env.PSTOCK_MANAGER,
  SWPlumbing: process.env.PSTOCK_MANAGER,
  MowRo: process.env.PSTOCK_MANAGER
}

/**
 * goes through tasks and sets title to substring of desc
 * if no title is already set
 * @param {array} tasks
 */
const reassignTitle = (tasks) => {
  tasks.forEach((task) => {
    task.title = task.title || task.description.substring(0, 50)
  })
}

router
  .use('/tasks', router)
  .get('/', (req, res) => {
    const { _id } = req.session.user
    Task.find({ assignee: _id, archived: null })
      .then((tasks) => {
        reassignTitle(tasks)
        res.status(200).json(tasks)
      })
      .catch((err) => {
        res.status(500).json({ message: err.message })
      })
  })
  .get('/unassigned', (req, res) => {
    Task.find({ assignee: null, archived: null })
      .then((tasks) => {
        //  replace title with substring of desc if no title exists
        reassignTitle(tasks)
        res.status(202).json(tasks)
      })
      .catch((err) => {
        res.status(500).json({ message: err.message })
      })
  })
  .get('/assigned', (req, res) => {
    Task.find({
      assignee: {
        $nin: [null, req.session.user._id],
        $exists: true
      },
      archived: null
    })
      .then((tasks) => {
        reassignTitle(tasks)
        res.status(202).json(tasks)
      })
      .catch((err) => {
        res.status(500).json({ message: err.message })
      })
  })
  .get('/archived', (req, res) => {
    Task.find({ archived: true })
      .then((tasks) => {
        reassignTitle(tasks)
        res.status(202).json(tasks)
      })
      .catch((err) => {
        res.status(500).json({ message: err.message })
      })
  })
  .post('/', (req, res) => {
    const data = req.body
    const task = new Task(data)

    task
      .save()
      .then((newTask) => {
        if (SITE_MANAGERS[newTask.site]) {
          sendMail(
            SITE_MANAGERS[newTask.site],
            `A new ${newTask.site} task, "${newTask.title}", was posted on Gogrello and you are the ${newTask.site} site manager.`
          )
        }

        res.status(200).json({ newTask })
      })
      .catch((err) => {
        res.status(500).json({ message: err.message })
      })
  })
  .put('/', (req, res) => {
    const { taskId, update } = req.body
    // if (!req.user.tasks.includes(taskId)) {
    //     return res.status(401).json({ message: 'You dont own that task' })
    // }
    Task.findByIdAndUpdate(taskId, update, { new: true })
      .then((updatedTask) => {
        const loggedInUser = req.session.user._id
        const assignee = User.findById(updatedTask.assignee)
        const reporter = User.findById(updatedTask.reporter)
        if (loggedInUser === assignee) {
          sendMail(
            reporter.email,
            `${assignee.firstName} updated the task ${updatedTask.title}`
          )
        } else if (loggedInUser === reporter) {
          sendMail(
            assignee.email,
            `${reporter.firstName} updated the task ${updatedTask.title}`
          )
        }
        return res.status(200).json({ updatedTask })
      })
      .catch((err) => {
        return res.status(500).json({ message: err.message })
      })
  })
  .put('/take', (req, res) => {
    const { task } = req.body
    const { _id } = req.session.user
    Task.findByIdAndUpdate(
      task._id,
      { assignee: _id, status: 'To Do' },
      { new: true }
    )
      .then((takenTask) => {
        const assignee = User.findById(takenTask.assignee)
        const reporter = User.findById(takenTask.reporter)

        sendMail(
          SITE_MANAGERS[takenTask.site],
          `${assignee.firstName} has taken the ${takenTask.site} task "${takenTask.title}" and you are the site manager for this task.`
        )
        sendMail(
          reporter.email,
          `${assignee.firstName} has taken the task "${takenTask.title}" that you posted.`
        )
        res.status(200).json(takenTask)
      })
      .catch((err) => {
        res.status(500).json({ message: err.message })
      })
  })
  .put('/move', async (req, res) => {
    const { task, board } = req.body
    // returned value
    const tasks = {
      board: board._id,
      value: []
    }

    // reassign all indexes
    await board.tasks.forEach((task, index) =>
      Task.findByIdAndUpdate(
        task._id,
        { index },
        { new: true },
        async (err, task) => {
          if (err) return res.status(500).json({ message: err.message })
          await tasks.value.push(task)
        }
      )
    )

    Task.findById(task._id, (err, task) => {
      if (err || !task)
        return res.status(500).json(err ? { err } : 'No task found')

      // old board _id should be populated on the task itself
      Board.findById(task.board, async function(err, oldBoard) {
        if (err || !oldBoard) return err || 'No Old Board found'
        oldBoard.tasks = await oldBoard.tasks.filter(
          (id) => id.toString() !== task._id.toString()
        )
        oldBoard
          .save()
          .then(() => {
            // update task to have the new board _id
            task.board = board._id
            task.status = board.title
            task
              .save()
              .then(async (newTask) => {
                await tasks.value.sort((a, b) => a.index - b.index)
                return res.status(200).json({ tasks })
              })
              .catch((err) => {
                return res.status(500).json({ err })
              })
          })
          .catch((err) => {
            return res.status(500).json({ err })
          })
      })
    })
  })

  .post('/archive', (req, res) => {
    const { taskId } = req.body

    Task.findByIdAndUpdate(taskId, { archived: true }, { new: true })
      .then((archivedTask) => {
        const assignee = User.findById(archivedTask.assignee)
        const reporter = User.findById(archivedTask.reporter)

        sendMail(
          `${reporter.email}, ${assignee.email}`,
          `The task "${archivedTask.title}" has been archived. This may be because it has been finised or it is no longer relevant. If you have any questions, contact ${req.session.user.firstName} at ${req.session.user.email} as he or she is the one who archived it.`
        )
        res.status(200).json({ archivedTask })
      })
      .catch((err) => {
        res.status(500).json({ message: err.message })
      })
  })
  .post('/unarchive', (req, res) => {
    const { taskId } = req.body

    Task.findByIdAndUpdate(taskId, { archived: null }, { new: true })
      .then((unarchivedTask) => {
        // const assignee = User.findById(unarchivedTask.assignee)
        // const reporter = User.findById(unarchivedTask.reporter)
        //
        // sendMail(
        //     `${reporter.email}, ${assignee.email}`,
        //     `The task "${unarchivedTask.title}" has been archived. This may be because it has been finised or it is no longer relevant. If you have any questions, contact ${req.session.user.firstName} at ${req.session.user.email} as he or she is the one who archived it.`
        // )
        res.status(200).json({ unarchivedTask })
      })
      .catch((err) => {
        res.status(500).json({ message: err.message })
      })
  })

  .post('/uploadcsv', upload.single('file'), csvCont.bulkTaskUpload)

module.exports.router = router
