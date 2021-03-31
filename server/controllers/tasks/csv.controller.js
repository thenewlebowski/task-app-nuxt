const fs = require('fs-js')
const csv = require('fast-csv')
const Task = require('../../models/Task')
const User = require('../../models/User')

/* global __baseDir */

/**
 * bulk task upload method
 * parse csv file into the
 * tasks collection
 *
 * @param {object} req
 * @param {object} res
 * @returns {json}
 */

const bulkTaskUpload = (req, res) => {
  try {
    if (req.file === undefined) {
      return res.status(400).send('Please upload a CSV file!')
    }

    const path = __baseDir + '/resources/uploads/' + req.file.filename
    const streamReadOpts = { autoClose: true }

    fs.createReadStream(path, streamReadOpts)
      .pipe(csv.parse({ headers: true }))
      .on('error', (error) => {
        throw error.message
      })
      .on('data', async (row) => {
        try {
          // reporter & assignee logic
          let assignee = {
            _id: null
          }
          let reporter = {
            _id: null
          }

          console.log('Assignee is: ' + row.assignee)
          // find assignee by username from master work list assignee
          if (row.assignee) {
            await User.findOne(
              { username: row.assignee.toUpperCase() },
              async (err, user) => {
                if (err) return console.log(err)
                if (user) {
                  return (assignee = user)
                }
                // if no user create a new user with corresponding username
                await User.create(
                  { username: row.assignee.toUpperCase() },
                  (err, user) => {
                    if (err) return console.log(err.message)
                    return (assignee = user)
                  }
                )
              }
            )
          } else {
            assignee._id = null
          }

          console.log('Reporter is: ' + row.reporter)
          // find reporter by username from master work list reporter
          if (row.reporter) {
            await User.findOne(
              { username: row.reporter.toUpperCase() },
              async (err, user) => {
                if (err) return console.log(err)
                if (user) {
                  return (reporter = user)
                }
                // if no user create a new user with corresponding username
                await User.create(
                  { username: row.reporter.toUpperCase() },
                  (err, user) => {
                    if (err) return console.log(err.message)
                    return (reporter = user)
                  }
                )
              }
            )
          } else {
            reporter._id = '6046b01ed5ca7434f7e2fbff'
          }

          // match old lingo with more robust lingo
          const lingo = {
            Task: 'Task',
            Bug: 'Problem',
            Theme: 'Styling',
            Story: 'General',
            Epic: 'General'
          }

          row.board = null
          row.assignee = assignee._id
          row.reporter = reporter._id
          row.type = lingo[row.type]

          if (!row.type) row.type = 'General'
          if (!row.points) row.points = 10
          if (!row.priority) row.priority = 'Low'

          Task.findOne(
            { title: row.title, dateAdded: new Date(row.dateAdded) },
            (err, task) => {
              if (err) return console.log(err)
              if (!task) {
                const task = new Task()
                task.board = row.board
                task.title = row.title
                task.description = row.description
                task.priority = row.priority
                task.type = row.type
                task.status = row.status
                task.assignee = row.assignee
                task.reporter = row.reporter
                task.dateAdded = row.dateAdded || Date.now
                task.dateCompleted = row.dateCompleted
                task.points = row.points
                task.site = 'General'
                console.log('Created New Task')
                return task.save()
              } else {
                task.points = row.points
                task.board = row.board
                task.title = row.title
                task.description = row.description
                task.priority = row.priority
                task.type = row.type
                task.status = row.status
                task.assignee = row.assignee
                task.reporter = row.reporter
                task.dateAdded = row.dateAdded || Date.now
                task.dateCompleted = row.dateCompleted
                console.log('Task Updated')
                task.update()
              }
            }
          )
        } catch (err) {
          console.log(err)
          console.log(row)
        }
      })
      .on('end', () => {
        return res.status(200).json({
          message: 'Successfully upload task csv file.'
        })
      })
  } catch (error) {
    res.status(500).send({
      message: 'Could not upload the file: ' + req.file.originalname
    })
  }
}

module.exports = {
  bulkTaskUpload
}
