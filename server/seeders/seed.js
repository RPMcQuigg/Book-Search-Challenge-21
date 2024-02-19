const db = require('../config/connection');
const { User, Book } = require('../models');
const userSeeds = require('./userSeeds.json');
const bookSeeds = require('./bookSeeds.json');
const cleanDB = require('./cleanDB');

db.once('open', async () => {
  try {
    // Clean existing data from the database
    await cleanDB('Book', 'books');
    await cleanDB('User', 'users');

    // Create users
    await User.create(userSeeds);

    // Create books and associate them with users
    for (let i = 0; i < bookSeeds.length; i++) {
      const { _id, author } = await Book.create(bookSeeds[i]);
      const user = await User.findOneAndUpdate(
        { username: author },
        {
          $addToSet: {
            books: _id,
          },
        }
      );
    }
  } catch (err) {
    console.error(err);
    process.exit(1);
  }

  console.log('Seeding completed successfully!');
  process.exit(0);
});
