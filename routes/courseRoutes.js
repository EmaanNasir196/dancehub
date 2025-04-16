const express = require("express");
const router = express.Router();
const courseController = require("../controllers/courseController");

router.get("/", courseController.getAllCourses);
router.get("/add-course", courseController.getAddCourse);
router.post("/add-course", courseController.addCourse);
router.get("/course/:id", courseController.getCourseDetail);
router.get("/courses/:id/edit", courseController.getEditCourse);

// Handle update POST
router.post("/courses/:id/update", courseController.updateCourse);
router.post("/course/:id/enroll", courseController.enrollInCourse);

router.post("/courses/:id/delete", courseController.deleteCourse);
router.post(
  "/course/:courseId/remove/:studentEmail",
  courseController.removeStudentFromCourse
);
router.get("/course/:id/success", courseController.enrollAfterPayment);

module.exports = router;
