const mongoose = require('mongoose')
const User = require('./User')
const Board = require('./Board')
const ObjectId = mongoose.Schema.Types.ObjectId

const TaskSchema = mongoose.Schema(
  {
    title: {
      type: String
      // required: true
    },
    board: {
      type: ObjectId,
      required: false
    },
    description: {
      type: String,
      unique: true
    },
    priority: {
      type: String,
      required: true,
      enum: ['Lowest', 'Low', 'Medium', 'High', 'Highest']
    },
    type: {
      type: String,
      // required: true,
      enum: ['Task', 'Problem', 'General', 'Styling']
    },
    points: {
      type: Number,
      default: 10,
      required: true
    },
    status: {
      type: String,
      required: true,
      enum: ['To Do', 'In Progress', 'Done', 'Backlog']
    },
    index: {
      type: Number
    },
    site: {
      type: String,
      required: true,
      enum: [
        'Adams&Co',
        'CaseInPoint',
        'Confluence',
        'Connectship',
        'CowboyLiving',
        'CraftDirect',
        'MonkeyWrench',
        'PlumbersStock',
        'Typhoeus',
        'Rayie',
        'SWPlumbing',
        'SupplyExchange',
        'Third Party',
        'Uncategorized',
        'General',
        'IT Task',
        'Marketplace',
        'Wiser',
        'Strikeaprice',
        'TCGM',
        'WIT',
        'Google Express',
        'MowRo',
        'Alarm dot com'
      ]
    },
    assignee: {
      type: ObjectId,
      ref: 'User'
    },
    reporter: {
      type: ObjectId,
      ref: 'User'
    },
    dateAdded: {
      type: mongoose.Schema.Types.Date,
      default: Date.now
    },
    dateCompleted: {
      type: mongoose.Schema.Types.Date,
      default: null
    },
    // board: [{ type: ObjectId, ref: 'Board' }],
    column: {
      type: ObjectId,
      ref: 'Column'
    },
    archived: {
      type: Boolean,
      default: null
    }
  },
  {
    timestamps: true
  }
)
TaskSchema.pre('save', function(next) {
  if (this.assignee) {
    User.findById(this.assignee, (err, user) => {
      if (err) return console.log(err)
      user.tasks.filter((task) => task.toString() !== this._id.toString())
      user.tasks.push(this._id)
      user.update()
    })
  }
  next()
})

TaskSchema.pre('update', function(next) {
  if (!this.type || this.type === '') this.type = 'General'

  if (
    this.type === 'Epic' ||
    this.type === 'Story' ||
    this.type === 'Bug' ||
    this.type === 'Theme'
  ) {
    switch (this.type) {
      case 'Epic':
        this.type = 'General'
        break
      case 'Story':
        this.type = 'General'
        break
      case 'Bug':
        this.type = 'Problem'
        break
      case 'Theme':
        this.type = 'Theme'
        break
    }
  }

  // archived update
  if (this.archived) {
    Board.findOne({ _id: this.board }, (err, board) => {
      if (err) return console.log(err)
      board.tasks = board.tasks.filter((t) => t !== this._id)
      board.update()
    })

    User.findOne({ _id: this.assignee }, (err, user) => {
      if (err) return console.log(err)
      user.tasks = user.tasks.filter((t) => t !== this._id)
      user.update()
    })
  }
  next()
})

TaskSchema.pre('save', function(next) {
  if (!this.type || this.type === '') this.type = 'General'

  if (
    this.type === 'Epic' ||
    this.type === 'Story' ||
    this.type === 'Bug' ||
    this.type === 'Theme'
  ) {
    switch (this.type) {
      case 'Epic':
        this.type = 'General'
        break
      case 'Story':
        this.type = 'General'
        break
      case 'Bug':
        this.type = 'Problem'
        break
      case 'Theme':
        this.type = 'Theme'
        break
    }
  }

  if (!this.title) this.title = this.description.substring(0, 100)
  // Board.findOne({_id: this.board}, (err, board) => {
  //   if(err) return console.log(err)
  //   board.tasks = board.tasks.filter(t => t !== this._id)
  //   board.push(this._id)
  //   board.update();
  //   next()
  // })
})

module.exports =
  mongoose.models.Task || mongoose.model('Task', TaskSchema, 'tasks')
