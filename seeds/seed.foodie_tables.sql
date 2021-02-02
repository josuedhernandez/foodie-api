  -- ('dunder', 'Dunder Mifflin', null, 'password'),
  -- ('b.deboop', 'Bodeep Deboop', 'Bo', 'bo-password'),
  -- ('c.bloggs', 'Charlie Bloggs', 'Charlie', 'charlie-password'),
  -- ('s.smith', 'Sam Smith', 'Sam', 'sam-password'),
  -- ('lexlor', 'Alex Taylor', 'Lex', 'lex-password'),
  -- ('wippy', 'Ping Won In', 'Ping', 'ping-password');

BEGIN;

TRUNCATE
  foodie_comments,
  foodie_restaurants,
  foodie_users
  RESTART IDENTITY CASCADE;

-- Todo: change nickname for email
INSERT INTO foodie_users (user_name, full_name, nickname, password)
VALUES
  ('dunder', 'Dunder Mifflin', null, '$2a$12$lHK6LVpc15/ZROZcKU00QeiD.RyYq5dVlV/9m4kKYbGibkRc5l4Ne'),
  ('b.deboop', 'Bodeep Deboop', 'Bo', '$2a$12$VQ5HgWm34QQK2rJyLc0lmu59cy2jcZiV6U1.bE8rBBnC9VxDf/YQO'),
  ('c.bloggs', 'Charlie Bloggs', 'Charlie', '$2a$12$2fv9OPgM07xGnhDbyL6xsuAeQjAYpZx/3V2dnu0XNIR27gTeiK2gK'),
  ('s.smith', 'Sam Smith', 'Sam', '$2a$12$/4P5/ylaB7qur/McgrEKwuCy.3JZ6W.cRtqxiJsYCdhr89V4Z3rp.'),
  ('lexlor', 'Alex Taylor', 'Lex', '$2a$12$Hq9pfcWWvnzZ8x8HqJotveRHLD13ceS7DDbrs18LpK6rfj4iftNw.'),
  ('wippy', 'Ping Won In', 'Ping', '$2a$12$ntGOlTLG5nEXYgDVqk4bPejBoJP65HfH2JEMc1JBpXaVjXo5RsTUu');

INSERT INTO foodie_restaurants (restaurant_name, cuisine, rating, author_id, meal)
VALUES
  ('First restaurant!', 'Chineese', 5, 1, 'Fried Rice'),
  ('Second restaurant!', 'Mexican', 4, 2, 'Carne Asada Tacos'),
  ('Third restaurant!', 'Indian', 3, 3, 'Chicken Biryani'),
  ('Fourth restaurant', 'American', 2, 4, 'Hamburger'),
  ('Fifth restaurant', 'Italian', 1, 5, 'Calzone'),
  ('Sixth restaurant', 'Italian', 2, 6, 'Gnocchi'),
  ('Seventh restaurant', 'Italian', 3, 1, 'Spaghetti'),
  ('Eigth restaurant', 'Mexican', 4, 2, 'Sope'),
  ('Ninth restaurant', 'Chineese', 5, 3, 'Spring roll'),
  ('Tenth restaurant', 'Indian', 4, 4, 'Wonton');

INSERT INTO foodie_comments (
  text,
  rating,
  restaurant_id,
  user_id
) VALUES
  (
    'This post is amazing',
    5,
    1,
    2
  ),
  (
    'Yeh I agree it''s amazing',
    3,
    1,
    3
  ),
  (
    'I would go so far as to say it''s double amazing',
    2,
    1,
    4
  ),
  (
    'A-mazing!',
    1,
    1,
    5
  ),
  (
    'That''s some interesting lorems you raise',
    2,
    2,
    6
  ),
  (
    'Yeh totally I''d never thought about lorems like that before',
    3,
    2,
    1
  ),
  (
    'So you''re saying consectetur adipisicing elit?',
    4,
    2,
    3
  ),
  (
    'Sixth? You mean sith?!!',
    5,
    4,
    6
  ),
  (
    'What do you call an evil procrastinator? Darth Later! Hahahahaha!',
    5,
    4,
    4
  ),
  (
    'Ten ten ten ten ten ten ten!',
    4,
    10,
    3
  ),
  (
    'Iste, architecto obcaecati tenetur quidem voluptatum ipsa quam!!!',
    3,
    10,
    5
  ),
  (
    '5, 6, 7, 8! My boot-scootin'' baby is drivin'' me crazy...!',
    2,
    7,
    1
  ),
  (
    'My obsession from a western! My dance floor date',
    1,
    7,
    2
  ),
  (
    'My rodeo Romeo. A cowboy god from head to toe',
    2,
    7,
    3
  ),
  (
    'Wanna make you mine. Better get in line. 5, 6, 7, 8!',
    3,
    7,
    4
  ),
  (
    'Just a lonely comment',
    4,
    9,
    6
  ),
  (
    'Really? Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris??!',
    5,
    6,
    5
  ),
  (
    'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris for sure!!',
    4,
    6,
    1
  ),
  (
    'WOAH!!!!!',
    3,
    8,
    2
  ),
  (
    '°º¤ø,¸¸,ø¤º°`°º¤ø,¸,ø¤°º¤ø,¸¸,ø¤º°`°º¤ø,¸',
    2,
    8,
    4
  );

COMMIT;