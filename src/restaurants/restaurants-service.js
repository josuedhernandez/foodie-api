const xss = require("xss");

const RestaurantsService = {
  getAllRestaurants(db) {
    return db
      .from("foodie_restaurants AS rest")
      .select(
        "rest.id",
        "rest.restaurant_name",
        "rest.date_created",
        "rest.rating",
        "rest.cuisine",
        "rest.meal",
        db.raw(`count(DISTINCT comm) AS number_of_comments`),
        db.raw(
          `json_strip_nulls(
            json_build_object(
              'id', usr.id,
              'user_name', usr.user_name,
              'full_name', usr.full_name,
              'nickname', usr.nickname,
              'date_created', usr.date_created,
              'date_modified', usr.date_modified
            )
          ) AS "author"`
        )
      )
      .leftJoin("foodie_comments AS comm", "rest.id", "comm.restaurant_id")
      .leftJoin("foodie_users AS usr", "rest.author_id", "usr.id")
      .groupBy("rest.id", "usr.id");
  },

  getById(db, id) {
    return RestaurantsService.getAllRestaurants(db)
      .where("rest.id", id)
      .first();
  },

  getCommentsForRestaurant(db, restaurant_id) {
    return db
      .from("foodie_comments AS comm")
      .select(
        "comm.id",
        "comm.text",
        "comm.rating",
        "comm.date_created",
        db.raw(
          `json_strip_nulls(
            row_to_json(
              (SELECT tmp FROM (
                SELECT
                  usr.id,
                  usr.user_name,
                  usr.full_name,
                  usr.nickname,
                  usr.date_created,
                  usr.date_modified
              ) tmp)
            )
          ) AS "user"`
        )
      )
      .where("comm.restaurant_id", restaurant_id)
      .leftJoin("foodie_users AS usr", "comm.user_id", "usr.id")
      .groupBy("comm.id", "usr.id");
  },

  serializeRestaurant(restaurant) {
    const { author } = restaurant;
    return {
      id: restaurant.id,
      cuisine: restaurant.cuisine,
      restaurant_name: xss(restaurant.restaurant_name),
      meal: xss(restaurant.meal),
      date_created: new Date(restaurant.date_created),
      number_of_comments: Number(restaurant.number_of_comments) || 0,
      rating: restaurant.rating,
      author: {
        id: author.id,
        user_name: author.user_name,
        full_name: author.full_name,
        nickname: author.nickname,
        date_created: new Date(author.date_created),
        date_modified: new Date(author.date_modified) || null,
      },
    };
  },

  serializeRestaurantComment(comment) {
    const { user } = comment;
    return {
      id: comment.id,
      restaurant_id: comment.restaurant_id,
      rating: comment.rating,
      text: xss(comment.text),
      date_created: new Date(comment.date_created),
      user: {
        id: user.id,
        user_name: user.user_name,
        full_name: user.full_name,
        nickname: user.nickname,
        date_created: new Date(user.date_created),
        date_modified: new Date(user.date_modified) || null,
      },
    };
  },
};

module.exports = RestaurantsService;
