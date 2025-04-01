const Datastore = require("nedb-promises");
const path = require("path");

const Course = Datastore.create({
  filename: path.join(__dirname, "../db/courses.db"),
  autoload: true,
});

module.exports = Course;
