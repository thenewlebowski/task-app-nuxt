const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId

const TaskSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true
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
      required: true,
      enum: ['Task', 'Problem', 'General', 'Styling']
    },
    points: {
      type: Number,
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

module.exports =
  mongoose.models.Task || mongoose.model('Task', TaskSchema, 'tasks')
