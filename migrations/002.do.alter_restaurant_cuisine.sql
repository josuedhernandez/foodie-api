CREATE TYPE type_cuisine AS ENUM (
  'Chineese',
  'Mexican',
  'Indian',
  'American',
  'Italian'
);
ALTER TABLE foodie_restaurants
  ADD COLUMN
    cuisine type_cuisine,;