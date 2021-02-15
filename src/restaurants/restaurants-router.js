const express = require("express");
const path = require("path");
const RestaurantsService = require("./restaurants-service");
const { requireAuth } = require("../middleware/jwt-auth");

const jsonBodyParser = express.json();
const restaurantsRouter = express.Router();

restaurantsRouter
  // restaurants endpoint search query
  // restaurants/search
  // sepecify multiple columns
  // like query
  .route("/")
  .get((req, res, next) => {
    RestaurantsService.getAllRestaurants(req.app.get("db"))
      .then((restaurants) => {
        res.json(restaurants.map(RestaurantsService.serializeRestaurant));
      })
      .catch(next);
  })
  .post(requireAuth, jsonBodyParser, (req, res, next) => {
    const { restaurant_name, cuisine, rating, meal } = req.body;
    const newRestaurant = { restaurant_name, cuisine, rating, meal };

    for (const [key, value] of Object.entries(newRestaurant))
      if (value == null)
        return res.status(400).json({
          error: `Missing '${key}' in request body`,
        });

    newRestaurant.author_id = req.user.id;

    RestaurantsService.insertRestaurant(req.app.get("db"), newRestaurant)
      .then((restaurant) => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `/${restaurant.id}`))
          .json(RestaurantsService.serializeRestaurant(restaurant));
      })
      .catch(next);
  });

restaurantsRouter
  .route("/:restaurant_id")
  .all(requireAuth)
  .all(checkRestaurantExists)
  .get((req, res) => {
    res.json(RestaurantsService.serializeRestaurant(res.restaurant));
  });

restaurantsRouter
  .route("/:restaurant_id/comments/")
  .all(requireAuth)
  .all(checkRestaurantExists)
  .get((req, res, next) => {
    RestaurantsService.getCommentsForRestaurant(
      req.app.get("db"),
      req.params.restaurant_id
    )
      .then((comments) => {
        res.json(comments.map(RestaurantsService.serializeRestaurantComment));
      })
      .catch(next);
  });

/* async/await syntax for promises */
async function checkRestaurantExists(req, res, next) {
  try {
    const restaurant = await RestaurantsService.getById(
      req.app.get("db"),
      req.params.restaurant_id
    );

    if (!restaurant)
      return res.status(404).json({
        error: `Restaurant doesn't exist`,
      });

    res.restaurant = restaurant;
    next();
  } catch (error) {
    next(error);
  }
}

module.exports = restaurantsRouter;
