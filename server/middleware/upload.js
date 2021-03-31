const multer = require('multer')

/* global __baseDir */

/**
 * filters csv types only
 * @param (object)
 * @param (object)  csv file
 * @return (void)
 */
// for every csv row create new task
const csvFilter = (req, file, cb) => {
  if (file.mimetype.includes('csv')) {
    cb(null, true)
  } else {
    cb('Please upload only csv file.', false)
  }
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, __baseDir + '/resources/uploads/')
  },
  filename: (req, file, cb) => {
    console.log(file.originalname)
    cb(null, `${Date.now()}-bezkoder-${file.originalname}`)
  }
})

const uploadFile = multer({ storage, fileFilter: csvFilter })
module.exports = uploadFile
