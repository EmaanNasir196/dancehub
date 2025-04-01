const express = require("express");
const router = express.Router();
const courseController = require("../controllers/courseController");

router.get("/", courseController.getAllCourses);
router.get("/add-course", courseController.getAddCourse);
router.post("/add-course", courseController.addCourse);
router.get("/course/:id", courseController.getCourseDetail);

module.exports = router;
