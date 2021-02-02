const express = require('express')
// const CommentsService = require('./comments-service')
// const { requireAuth } = require('../middleware/jwt-auth')

const restaurantsRouter = express.Router();

restaurantsRouter
    .route('/')
    // .all(requireAuth)
    .get((req, res) => {
  res.send("Hello, world! I'm a comment");
});

module.exports = restaurantsRouter