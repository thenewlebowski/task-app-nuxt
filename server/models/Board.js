const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId
const User = require('./User')

const BoardSchema = mongoose.Schema(
  {
    color: {
      type: String,
      default: '#3F51B5',
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

BoardSchema.post('save', function() {
  const Task = require('./Task')
  const payload = {
    status: this.title,
    board: {
      color: this.color,
      title: this.title,
      _id: this._id
    }
  }
  this.tasks.map((t) => {
    Task.findOneAndUpdate({ _id: t }, payload, { new: true }, (err, task) => {
      if (err) return err
      return task
    })
  })
})

BoardSchema.pre('save', function(next) {
  const self = this

  // if no index is assigned assign it to the largest index
  if (!self.index && self.index !== 0) {
    this.constructor.find({ owner: this.owner }, (err, boards) => {
      if (err) return err
      self.index = boards.length
    })
  }
  next()
})

BoardSchema.pre('delete', function(next) {
  const Task = require('./Task')

  this.tasks.forEach((task) => {
    Task.findById(task, (err, task) => {
      if (err) return err
      task.delete()
    })
  })
  User.findById(this.owner, (err, user) => {
    if (err) return err
    const filtered = user.board.filter((b) => b !== this._id)
    user.board = filtered
    user.save()
  })
  next()
})

module.exports = mongoose.model('Board', BoardSchema, 'boards')
