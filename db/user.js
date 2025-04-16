// db/users.js (example)
const Datastore = require("nedb-promises");
const path = require("path");

const db = Datastore.create({
  filename: path.join(__dirname, "users.db"),
  autoload: true,
});

const insertUser = async (user) => {
  return db.insert(user); // Insert logic
};

module.exports = {
  insertUser,
};
