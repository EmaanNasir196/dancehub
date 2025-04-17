const fs = require("fs");
const path = require("path");
const mustache = require("mustache");
const Course = require("../models/Course");
const stripe = require("stripe")(
  "sk_test_51RERhd2NjD0aGkKad7x4MMXgFP4c3cGBy2ww8K1SmCbog9M8FGmYuuJ2jjNNfJmqVwhIZpO9lZ0vbPRS7uI9AtMM00KZVe5Law"
);

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
      isorganisation: req.cookies?.role === "organisation",
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
    organizer: req.body.organizer || "",
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
    isorganisation: req.cookies?.role === "organisation",
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
    return res.redirect("/login");
  }

  const page = fs.readFileSync("views/pages/add-course.mustache", "utf8");
  const layout = fs.readFileSync("views/layouts/main.mustache", "utf8");

  const html = mustache.render(layout, {
    title: "Add Course",
    body: page,
    user: req.cookies?.name || null,
    isorganisation: req.cookies?.role === "organisation",
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
    const currentUserEmail = req.cookies?.email;
    const alreadyEnrolled = (course.enrolled || []).includes(currentUserEmail);

    const page = fs.readFileSync("views/pages/course-detail.mustache", "utf8");
    const layout = fs.readFileSync("views/layouts/main.mustache", "utf8");

    const body = mustache.render(page, {
      ...course,
      isorganisation: req.cookies?.role === "organisation",
      currentUserEmail,
      alreadyEnrolled,
    });

    const html = mustache.render(layout, {
      title: course.name,
      body,
      user: req.cookies?.name || null,
      isorganisation: req.cookies?.role === "organisation",
    });
    console.log("Cookies:", req.cookies);
    console.log("Is Org:", req.cookies?.role === "organisation");

    res.send(html);
  } catch (err) {
    console.error("Error loading course detail:", err);
    res.status(500).send("Error loading course");
  }
};

const deleteCourse = async (req, res) => {
  if (req.cookies?.role !== "organisation") return res.redirect("/login");
  try {
    await Course.deleteOne({ _id: req.params.id });
    res.redirect("/");
  } catch (err) {
    console.error("Error deleting course:", err);
    res.status(500).send("Delete error");
  }
};

const updateCourse = async (req, res) => {
  if (req.cookies?.role !== "organisation") return res.redirect("/login");

  try {
    await Course.updateOne(
      { _id: req.params.id },
      {
        $set: {
          name: req.body.name,
          duration: req.body.duration,
          price: req.body.price,
          datetime: req.body.datetime,
          location: req.body.location,
          description: req.body.description,
          organizer: req.body.organizer, // <- Add this
        },
      }
    );
    res.redirect(`/course/${req.params.id}`);
  } catch (err) {
    console.error("Error updating course:", err);
    res.status(500).send("Update error");
  }
};

const getEditCourse = async (req, res) => {
  if (req.cookies?.role !== "organisation") return res.redirect("/login");

  try {
    const course = await Course.findOne({ _id: req.params.id });
    if (!course) return res.status(404).send("Course not found");

    const page = fs.readFileSync("views/pages/edit-course.mustache", "utf8");
    const layout = fs.readFileSync("views/layouts/main.mustache", "utf8");

    const body = mustache.render(page, course);

    const html = mustache.render(layout, {
      title: `Edit ${course.name}`,
      body,
      user: req.cookies?.name || null,
      isorganisation: req.cookies?.role === "organisation",
    });

    res.send(html);
  } catch (err) {
    console.error("Error loading edit form:", err);
    res.status(500).send("Error loading course");
  }
};

const enrollInCourse = async (req, res) => {
  const userEmail = req.cookies?.email;
  const userRole = req.cookies?.role;

  // Allow only logged-in, non-organisation users
  if (!userEmail || userRole === "organisation") {
    return res.redirect("/login");
  }

  try {
    const courseId = req.params.id;
    const course = await Course.findOne({ _id: courseId });

    if (!course) {
      return res.status(404).send("Course not found");
    }

    // Initialize enrolled list if not present
    const enrolledList = course.enrolled || [];

    // Avoid duplicate enrollment
    if (enrolledList.includes(userEmail)) {
      return res.redirect(`/course/${courseId}`);
    }

    // Create a Stripe Checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd", // Adjust currency as needed
            product_data: {
              name: course.name,
              description: course.description,
            },
            unit_amount: course.price * 100, // Price in cents
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.HOST_URL}/course/${courseId}/success`, // Redirect to success page
      cancel_url: `${process.env.HOST_URL}/course/${courseId}?cancel=true`, // Redirect to cancel page
    });

    // Redirect to Stripe Checkout
    res.redirect(303, session.url);
  } catch (err) {
    console.error("Error enrolling in course:", err);
    res.status(500).send("Error enrolling in course");
  }
};
const enrollAfterPayment = async (req, res) => {
  const courseId = req.params.id;
  const userEmail = req.cookies?.email;

  try {
    // Find the course
    const course = await Course.findOne({ _id: courseId });
    if (!course) {
      return res.status(404).send("Course not found");
    }

    // Add the user to the enrolled list if they haven't been added already
    const enrolledList = course.enrolled || [];
    if (!enrolledList.includes(userEmail)) {
      enrolledList.push(userEmail);

      // Update the course with the new enrolled list
      await Course.updateOne(
        { _id: courseId },
        { $set: { enrolled: enrolledList } }
      );
    }

    res.redirect(`/course/${courseId}`);
  } catch (err) {
    console.error("Error enrolling in course after payment:", err);
    res.status(500).send("Error enrolling in course");
  }
};

// POST /course/:courseId/remove/:studentEmail
const removeStudentFromCourse = async (req, res) => {
  const { courseId, studentEmail } = req.params;

  // Check if the user is an organisation
  if (req.cookies?.role !== "organisation") return res.redirect("/login");

  try {
    // Find the course by its ID
    const course = await Course.findOne({ _id: courseId });

    if (!course) {
      return res.status(404).send("Course not found");
    }

    // Filter out the student to be removed
    const updatedEnrolledList = course.enrolled.filter(
      (email) => email !== studentEmail
    );

    // Update the course with the new enrolled list
    await Course.updateOne(
      { _id: courseId },
      { $set: { enrolled: updatedEnrolledList } }
    );

    res.redirect(`/course/${courseId}`);
  } catch (err) {
    console.error("Error removing student:", err);
    res.status(500).send("Error removing student");
  }
};

module.exports = {
  getAddCourse,
  getAllCourses,
  addCourse,
  getCourseDetail,
  deleteCourse,
  updateCourse,
  getEditCourse,
  enrollInCourse,
  removeStudentFromCourse,
  enrollAfterPayment,
};
