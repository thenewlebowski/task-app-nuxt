const express = require('express')
const session = require('express-session')
const morgan = require('morgan')
const app = express()
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const mongoose = require('mongoose')
const cors = require('cors')

// load env variable
require('dotenv').config()

// global variables
global.__baseDir = __dirname
// connect to mongodb
mongoose.connect(process.env.MONGO_DB, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false
})
// .then(() => console.log(`connection successful: ${connection}`))
// .catch((err) => console.error(connection, err.message))

app.use(cookieParser())
app.use(bodyParser.json())

app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false
    // cookie: { maxAge: 600000 }
  })
)

app.use(
  cors({
    allowedHeaders: ['sessionId', 'Content-Type'],
    exposedHeaders: ['sessionId'],
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false
  })
)

app.use(morgan('tiny'))

const { router } = require('./routes')
app.use(router)

module.exports = {
  path: '/api',
  handler: app
}
