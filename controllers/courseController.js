const fs = require("fs");
const path = require("path");
const mustache = require("mustache");
const Course = require("../models/Course");

// GET /
const getAllCourses = async (req, res) => {
  console.log(req.cookies);
  try {
    const courses = await Course.find({});

    const page = fs.readFileSync(
      path.join(__dirname, "../views/pages/index.mustache"),
      "utf8"
    );
    const layout = fs.readFileSync(
      path.join(__dirname, "../views/layouts/main.mustache"),
      "utf8"
    );

    const body = mustache.render(
      page,
      { courses },
      {
        "course-item": fs.readFileSync(
          path.join(__dirname, "../views/partials/course-item.mustache"),
          "utf8"
        ),
      }
    );

    const html = mustache.render(layout, {
      title: "DanceHub",
      body,
      user: req.cookies?.name || null,
      isInstructor: req.cookies?.role === "instructor",
    });

    res.send(html);
  } catch (err) {
    console.error("Error loading courses:", err);
    res.status(500).send("Server Error");
  }
};

// POST /add-course
const addCourse = async (req, res) => {
  const newCourse = {
    name: req.body.name,
    duration: req.body.duration,
    price: req.body.price,
    datetime: req.body.datetime,
    location: req.body.location,
    description: req.body.description,
    createdBy: req.cookies?.name || "Unknown",
  };

  try {
    await Course.insert(newCourse);
    res.redirect("/");
  } catch (err) {
    console.error("Error adding course:", err);
    res.status(500).send("Insert error");
  }
};

let cachedCourses = [];

exports.getIndex = async (req, res) => {
  cachedCourses = await Course.find({});
  const coursesToShow = cachedCourses.slice(0, 3);

  const page = fs.readFileSync("views/pages/index.mustache", "utf8");
  const layout = fs.readFileSync("views/layouts/main.mustache", "utf8");

  const body = mustache.render(
    page,
    {
      courses: coursesToShow,
    },
    {
      "course-item": fs.readFileSync(
        "views/partials/course-item.mustache",
        "utf8"
      ),
      hero: fs.readFileSync("views/partials/hero.mustache", "utf8"),
    }
  );

  const html = mustache.render(layout, {
    title: "Dance Courses",
    body,
    user: req.cookies?.name || null,
    isInstructor: req.cookies?.role === "instructor",
  });

  res.send(html);
};

exports.loadMoreCourses = (req, res) => {
  const offset = parseInt(req.query.offset) || 0;
  const limit = 3;

  const nextCourses = cachedCourses.slice(offset, offset + limit);

  const courseCard = fs.readFileSync(
    "views/partials/course-item.mustache",
    "utf8"
  );
  const html = nextCourses
    .map((course) => mustache.render(courseCard, course))
    .join("");

  res.send(html);
};

// GET /add-course
const getAddCourse = (req, res) => {
  // ✅ Check for logged-in user
  if (!req.cookies?.name || !req.cookies?.email) {
    return res.status(403).send("You must be logged in to access this page.");
  }

  const page = fs.readFileSync("views/pages/add-course.mustache", "utf8");
  const layout = fs.readFileSync("views/layouts/main.mustache", "utf8");

  const html = mustache.render(layout, {
    title: "Add Course",
    body: page,
    user: req.cookies?.name || null,
    isInstructor: req.cookies?.role === "instructor",
  });

  res.send(html);
};

const getCourseDetail = async (req, res) => {
  const courseId = req.params.id;

  try {
    const results = await Course.find({ _id: courseId });
    const course = results[0];
    console.log(course);

    if (!course) return res.status(404).send("Course not found");

    const page = fs.readFileSync("views/pages/course-detail.mustache", "utf8");
    const layout = fs.readFileSync("views/layouts/main.mustache", "utf8");

    const body = mustache.render(page, course);

    const html = mustache.render(layout, {
      title: course.name,
      body,
      user: req.cookies?.name || null,
      isInstructor: req.cookies?.role === "instructor",
    });

    res.send(html);
  } catch (err) {
    console.error("Error loading course detail:", err);
    res.status(500).send("Error loading course");
  }
};

module.exports = {
  getAddCourse,
  getAllCourses,
  addCourse,
  getCourseDetail,
};
