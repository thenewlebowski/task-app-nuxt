const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId

const DepartmentSchema = mongoose.Schema({
  // department title
  title: {
    type: String,
    required: true,
    unique: true
  },
  // all staff associated with department
  staff: [
    {
      type: ObjectId,
      ref: 'User'
    }
  ]
})

module.exports =
  mongoose.models.Department ||
  mongoose.model('Department', DepartmentSchema, 'departments')
