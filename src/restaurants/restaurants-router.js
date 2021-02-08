const express = require('express')
const RestaurantsService = require('./restaurants-service')
const { requireAuth } = require('../middleware/jwt-auth')

const restaurantsRouter = express.Router()

restaurantsRouter
  .route('/')
  .get((req, res, next) => {
    RestaurantsService.getAllRestaurants(req.app.get('db'))
      .then(restaurants => {
        res.json(restaurants.map(RestaurantsService.serializeRestaurant))
      })
      .catch(next)
  })

restaurantsRouter
  .route('/:restaurant_id')
  .all(requireAuth)
  .all(checkRestaurantExists)
  .get((req, res) => {
    res.json(RestaurantsService.serializeRestaurant(res.restaurant))
  })

restaurantsRouter.route('/:restaurant_id/comments/')
  .all(requireAuth)
  .all(checkRestaurantExists)
  .get((req, res, next) => {
    RestaurantsService.getCommentsForRestaurant(
      req.app.get('db'),
      req.params.restaurant_id
    )
      .then(comments => {
        res.json(comments.map(RestaurantsService.serializeRestaurantComment))
      })
      .catch(next)
  })

/* async/await syntax for promises */
async function checkRestaurantExists(req, res, next) {
  try {
    const restaurant = await RestaurantsService.getById(
      req.app.get('db'),
      req.params.restaurant_id
    )

    if (!restaurant)
      return res.status(404).json({
        error: `Restaurant doesn't exist`
      })

    res.restaurant = restaurant
    next()
  } catch (error) {
    next(error)
  }
}

module.exports = restaurantsRouter