const Datastore = require("nedb-promises");
const path = require("path");
const bcrypt = require("bcryptjs");

const db = Datastore.create({
  filename: path.join(__dirname, "../db/users.db"),
  autoload: true,
});

const insertUser = async (user) => {
  const hashedPassword = await bcrypt.hash(user.password, 10);
  user.password = hashedPassword;
  return db.insert(user);
};

const findUserByEmail = async (email) => {
  return db.findOne({ email });
};

module.exports = {
  insertUser,
  findUserByEmail,
};
