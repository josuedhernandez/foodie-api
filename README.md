# Foodie API

Food API is the backend for [Foodie App](https://foodie-psi.vercel.app/) a search app for restaurants. More features as recipes for meals will he added.

## Stack

Written using NODE.js, Express and PostgreSQL

## Documentation

### Base URL
Base URL: [https://morning-castle-66587.herokuapp.com/api](https://morning-castle-66587.herokuapp.com/api)

### Public
* GET `/restaurants` fetches list of restaurants in the database.
  *  The response looks like:
  ```
      {
      id: 1,
      restaurant_name: "First test post!",
      rating: 1,
      cuisine: "Chineese",
      author_id: users.id,
      date_created: new Date   ("2029-01-22T16:28:32.615Z"),
      meal: "Fried Rice"
      }
    ```
* POST `/auth/login` returns a JWT token if the correct username and password (using "bcryptjs") was provided:
  *  The response and JWT with 3 hours of expiration.

* POST `/auth/signup` posts and creates a new username in the database:
    *  The body looks like:
    ```
    {
        user_name: "First test post!",
        full_name: "My Name",  (use bycrytps)
        password: "$2a$12$lHK6LVpc15/ZROZcKU00QeiD.RyYq5dVlV/9m4kKYbGibkRc5l4Ne",
        nickname: "My nickname"  (not required)
    }
        ``` 

### Protected Endpoints
Need to authenticate with username and password to use protected endpoints. Using a JWT token.
* GET `/restaurants/:restaurant_id` fetch restaurant and comments for a restaurant in the database.
  *  The body looks like:
  ```
  {
      restaurant_name: "First test post!",
      rating: 1,
      cuisine: "Chineese",
      author_id: users.id,
      meal: "Fried Rice"
      comments: {
          text: "Comments of this place",
          rating: 1,
          restaurant_id: 4,
          user_id: 5
      }
      }
      ``` 
* GET `/restaurants/:restaurant_id/comments` fetch comments for a given restaurant.
* POST `/restaurants` create a new restaurant in the database.
  *  The body looks like:
  ```
  {
      restaurant_name: "First test post!",
      rating: 1,
      cuisine: "Chineese",
      author_id: users.id,
      meal: "Fried Rice"
      }
      ``` 
* POST `/comments` add new comment to an already existing restaurant in the database.
  *  The body looks like:
  ```
  {
      text: "Comments of this place",
      rating: 1,
      restaurant_id: 4,
      user_id: 5
      }
      ``` 

## Scripts

Start the application `npm start`

Start nodemon for the application `npm run dev`

Run the tests `npm test`

## Deploying

When your new project is ready for deployment, add a new Heroku application with `heroku create`. This will make a new git remote called "heroku" and you can then `npm run deploy` which will push to this remote's master branch.