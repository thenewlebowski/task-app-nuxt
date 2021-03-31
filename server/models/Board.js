const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId
const User = require('./User')
const Task = require('./Task')

const BoardSchema = mongoose.Schema(
  {
    color: {
      type: String,
      required: true
    },
    index: {
      type: Number,
      required: false
    },
    title: {
      type: String,
      required: true
    },
    publicBoard: {
      type: Boolean,
      required: true
    },
    owner: {
      type: ObjectId,
      ref: 'User'
    },
    tasks: [
      {
        type: ObjectId,
        ref: 'Task'
      }
    ]
  },
  {
    timestamps: true
  }
)

BoardSchema.pre('save', async function(next) {
  const self = this

  // if no index is assigned assign it to the largest index
  if (!self.index && self.index !== 0) {
    await this.constructor.find({ owner: this.owner }, (err, boards) => {
      if (err) return err
      self.index = boards.length
    })
  }

  await User.findById(this.owner, (err, user) => {
    if (err) return err
    user.board = user.board.filter((b) => b.toString() !== this._id.toString())
    user.board.push(this._id)
    user.update()
  })

  this.tasks.forEach((taskId) => {
    Task.findOneAndUpdate(
      { _id: taskId },
      { board: this._id },
      { new: true },
      (err, task) => {
        if (err) return err
        console.log(task)
      }
    )
  })

  await next()
})

BoardSchema.pre('delete', function(next) {
  User.findById(this.owner, (err, user) => {
    if (err) return console.log(err)
    const filtered = user.board.filter((b) => b !== this._id)
    user.board = filtered
    user.save()
  })
  next()
})

module.exports = mongoose.model('Board', BoardSchema)
