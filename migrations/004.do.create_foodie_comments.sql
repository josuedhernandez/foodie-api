CREATE TABLE foodie_comments (
    id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
    text TEXT NOT NULL,
    date_created TIMESTAMPTZ DEFAULT now() NOT NULL,
    rating INTEGER NOT NULL,
    restaurant_id INTEGER
        REFERENCES foodie_restaurants(id) ON DELETE CASCADE NOT NULL,
    user_id INTEGER
        REFERENCES foodie_users(id) ON DELETE CASCADE NOT NULL
);
