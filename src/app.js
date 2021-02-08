const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const helmet = require("helmet");
const { NODE_ENV } = require("./config");
const restaurantsRouter = require("./restaurants/restaurants-router");
// const commentsRouter = require("./comments/comments-router");
const authRouter = require('./auth/auth-router')
const usersRouter = require('./users/users-router')

const app = express();

app.use(morgan((NODE_ENV === 'production') ? 'tiny' : 'common', {
  skip: () => NODE_ENV === 'test',
}))
app.use(cors())
app.use(helmet())

// include sign up and login are public routes before jwt function
app.use('/api/auth', authRouter)

// add /login
// add /signup

// Protected routes need authentication for them to be accesible
app.use('/api/users', usersRouter)
app.use('/api/restaurants', restaurantsRouter)
// app.use('/api/comments', commentsRouter)

app.use(function errorHandler(error, req, res, next) {
  let response
  if (NODE_ENV === 'production') {
    response = { error: 'Server error' }
  } else {
    console.error(error)
    response = { error: error.message, object: error }
  }
  res.status(500).json(response)
})

module.exports = app
