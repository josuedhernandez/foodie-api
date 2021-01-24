const express = require("express");
const { requireAuth } = require("../middleware/basic-auth");

const restaurantsRouter = express.Router();
const jsonBodyParser = express.json();

restaurantsRouter
    .route('/')
    .all(requireAuth)
    .get((req, res) => {
  res.send("Hello, world!");
});

restaurantsRouter
    .route('/api/*')
    .all(requireAuth)
    .get((req, res) => {
  res.json({ ok: true });
});

module.exports = restaurantsRouter