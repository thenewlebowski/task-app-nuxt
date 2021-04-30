const mongoose = require('mongoose')
const User = require('./User')
const Board = require('./Board')
const ObjectId = mongoose.Schema.Types.ObjectId
const TypeObjectId = mongoose.Types.ObjectId
const TaskSchema = mongoose.Schema(
  {
    title: {
      type: String
      // required: true
    },
    public: {
      required: false,
      type: Boolean,
      default: true
    },
    board: {
      type: ObjectId,
      required: false,
      ref: 'Board'
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
      default: 'To Do',
      // required: true
    },
    index: {
      type: Number
    },
    color: {
      type: String,
      required: false,
      default: '#3F51B5'
    },
    site: {
      type: String,
      required: true,
      default: 'PlumbersStock',
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
    page: {
      type: ObjectId,
      ref: 'Page'
    },
    archived: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
)
TaskSchema.pre('save', function(next) {
  if (!this.reporter || new TypeObjectId(this.reporter) !== this.reporter) {
    //* note can probably look for an user before we assume its an unassigned reporter
    this.reporter = new TypeObjectId('6046b01ed5ca7434f7e2fbff')
  }
  if(!this.status) this.status = 'To Do'
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

  if (!this.title || this.title.length < 1)
    this.title = this.description.substring(0, 100)
  if (this.assignee) {
    User.findById(this.assignee, (err, user) => {
      if (err) return err
      user.tasks.filter((task) => task.toString() !== this._id.toString())
      user.tasks.push(this._id)
      user.update()
    })
  }

  if (this.board && !this.archived) {
    Board.findOne({ _id: this.board }, async (err, board) => {
      if (err) return err
      if (board) {
        board.tasks = await board.tasks.filter((t) => t !== this._id)
        await board.tasks.push(this._id)
        board.save()
      }
    })
  }

  // archived update
  if (this.archived) {
    Board.findOne({ _id: this.board }, async (err, board) => {
      if (err) return err
      board.tasks = await board.tasks.filter(
        (t) => t.toString() !== this._id.toString()
      )
      board.save()
    })

    User.findOne({ _id: this.assignee }, async (err, user) => {
      if (err) return err
      user.tasks = await user.tasks.filter(
        (t) => t.toString() !== this._id.toString()
      )
      user.save()
    })
  }
  next()
})
/**
 * below is all the update logic
 * handled before and after the
 * task has been updated
 */

// pre-update logic
TaskSchema.pre('update', function(next) {
  // if (!this.type || this.type === '') this.type = 'General'
  //* hack | to check for a valid mongo id you can cast the value to an object id
  if (!this.reporter || new TypeObjectId(this.reporter) !== this.reporter) {
    //* note can probably look for an user before we assume its an unassigned reporter
    this.reporter = new TypeObjectId('6046b01ed5ca7434f7e2fbff')
  }

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

  // update board with task aswell
  if (this.board && !this.archived) {
    Board.findOne({ _id: this.board }, (err, board) => {
      if (err) return err
      if (board) {
        board.tasks = board.tasks.filter((t) => t !== this._id)
        board.tasks.push(this._id)
        board.save()
      }
    })
  }

  // archived update
  if (this.archived) {
    Board.findOne({ _id: this.board }, async (err, board) => {
      if (err) return err
      board.tasks = await board.tasks.filter(
        (t) => t.toString() !== this._id.toString()
      )
      board.save()
    })

    User.findOne({ _id: this.assignee }, async (err, user) => {
      if (err) return err
      user.tasks = await user.tasks.filter(
        (t) => t.toString() !== this._id.toString()
      )
      user.save()
    })
  }
  next()
})
// post-update logic
TaskSchema.post('update', function(doc) {})
module.exports =
  mongoose.models.Task || mongoose.model('Task', TaskSchema, 'tasks')
