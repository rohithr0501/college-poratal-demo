const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth.middleware");
const permissionMiddleware = require("../middleware/permission.middleware");

const userController = require("../controllers/user.controller");

// Public signup API
router.post("/signup", (req, res) => userController.signup(req, res));

// Public login API
router.post("/login", (req, res) => userController.login(req, res));
router.get(
  "/test-teacher",
  authMiddleware,
  permissionMiddleware("Teacher"),
  (req, res) => {
    res.json({
      message: "Welcome Teacher",
      user: req.user,
    });
  },
);
// Get all students: Student and Teacher
router.get(
    "/students",
    authMiddleware,
    permissionMiddleware("Student", "Teacher"),
    (req, res) => userController.getAllStudents(req, res)
);
// Get student by ID
router.get(
    "/students/:id",
    authMiddleware,
    permissionMiddleware("Student", "Teacher"),
    (req, res) => userController.getStudentById(req, res)
);
// Get all students: Student and Teacher
router.get(
    "/students",
    authMiddleware,
    permissionMiddleware("Student", "Teacher"),
    (req, res) => userController.getAllStudents(req, res)
);
// Get all teachers - Teacher only
router.get(
    "/teachers",
    authMiddleware,
    permissionMiddleware("Teacher"),
    (req, res) => userController.getAllTeachers(req, res)
);
// Get teacher by ID - Teacher only
router.get(
    "/teachers/:id",
    authMiddleware,
    permissionMiddleware("Teacher"),
    (req, res) => userController.getTeacherById(req, res)
);
// Update own profile - Student and Teacher
router.put(
    "/profile",
    authMiddleware,
    permissionMiddleware("Student", "Teacher"),
    (req, res) => userController.updateProfile(req, res)
);
// Update student - Teacher only
router.put(
    "/students/:id",
    authMiddleware,
    permissionMiddleware("Teacher"),
    (req, res) => userController.updateStudent(req, res)
);
module.exports = router;
