const express = require('express')
// const RestaurantsService = require('./restaurants-service')
// const { requireAuth } = require('../middleware/jwt-auth')

const restaurantsRouter = express.Router();

restaurantsRouter
    .route('/')
    // .all(requireAuth)
    .get((req, res) => {
  res.send("Hello, world!");
});

restaurantsRouter
    .route('/:restaurant_id')
    // .all(requireAuth)
    .get((req, res) => {
  res.json({ ok: true });
});

module.exports = restaurantsRouter