const userService = require("../services/user.service");

class UserController {
  // Student and Teacher Signup
  async signup(req, res) {
    try {
      const { name, email, password, role } = req.body;

      // Check required fields
      if (!name || !email || !password || !role) {
        return res.status(400).json({
          message: "Name, email, password and role are required",
        });
      }

      // Validate data types
      if (
        typeof name !== "string" ||
        typeof email !== "string" ||
        typeof password !== "string" ||
        typeof role !== "string"
      ) {
        return res.status(400).json({
          message: "All fields must be strings",
        });
      }

      // Validate role
      if (!["Student", "Teacher"].includes(role)) {
        return res.status(400).json({
          message: "Role must be Student or Teacher",
        });
      }

      if (password.length < 6) {
        return res.status(400).json({
          message: "Password must contain at least 6 characters",
        });
      }

      const user = await userService.signup({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password,
        role,
      });

      return res.status(201).json({
        message: "Signup successful",
        user,
      });
    } catch (error) {
      if (error.message === "Email already registered") {
        return res.status(409).json({
          message: error.message,
        });
      }

      return res.status(500).json({
        message: "Signup failed",
        error: error.message,
      });
    }
  }

  // Student and Teacher Login
  async login(req, res) {
    try {
      const { email, password } = req.body;

      // Check required fields
      if (!email || !password) {
        return res.status(400).json({
          message: "Email and password are required",
        });
      }

      if (typeof email !== "string" || typeof password !== "string") {
        return res.status(400).json({
          message: "Email and password must be strings",
        });
      }

      // Call login service
      const result = await userService.login(email.trim(), password);

      return res.status(200).json({
        message: "Login successful",
        token: result.token,
        user: result.user,
      });
    } catch (error) {
      if (error.message === "Invalid email or password") {
        return res.status(401).json({
          message: "Invalid email or password",
        });
      }

      return res.status(500).json({
        message: "Login failed",
        error: error.message,
      });
    }
  }
  // Get all students
  async getAllStudents(req, res) {
    try {
      const students = await userService.getAllStudents();

      return res.status(200).json({
        message: "Students retrieved successfully",
        count: students.length,
        students: students,
      });
    } catch (error) {
      return res.status(500).json({
        message: "Failed to retrieve students",
        error: error.message,
      });
    }
  }
  // Get student by ID
  async getStudentById(req, res) {
    try {
      const { id } = req.params;

      // Students can access only their own profile
      if (req.user.role === "Student" && req.user.id !== id) {
        return res.status(403).json({
          message: "You can access only your own profile",
        });
      }

      const student = await userService.getStudentById(id);

      if (!student) {
        return res.status(404).json({
          message: "Student not found",
        });
      }

      return res.status(200).json({
        message: "Student retrieved successfully",
        student,
      });
    } catch (error) {
      if (error.name === "CastError" || error.name === "BSONError") {
        return res.status(400).json({
          message: "Invalid student ID",
        });
      }

      return res.status(500).json({
        message: "Failed to retrieve student",
        error: error.message,
      });
    }
  }
  // Get all students
  async getAllStudents(req, res) {
    try {
      const students = await userService.getAllStudents();

      return res.status(200).json({
        message: "Students retrieved successfully",
        count: students.length,
        students: students,
      });
    } catch (error) {
      return res.status(500).json({
        message: "Failed to retrieve students",
        error: error.message,
      });
    }
  }
  // Get all teachers
  async getAllTeachers(req, res) {
    try {
      const teachers = await userService.getAllTeachers();

      return res.status(200).json({
        message: "Teachers retrieved successfully",
        count: teachers.length,
        teachers: teachers,
      });
    } catch (error) {
      return res.status(500).json({
        message: "Failed to retrieve teachers",
        error: error.message,
      });
    }
  }
  // Get teacher by ID
  async getTeacherById(req, res) {
    try {
      const { id } = req.params;

      const teacher = await userService.getTeacherById(id);

      if (!teacher) {
        return res.status(404).json({
          message: "Teacher not found",
        });
      }

      return res.status(200).json({
        message: "Teacher retrieved successfully",
        teacher,
      });
    } catch (error) {
      if (error.name === "CastError" || error.name === "BSONError") {
        return res.status(400).json({
          message: "Invalid teacher ID",
        });
      }

      return res.status(500).json({
        message: "Failed to retrieve teacher",
        error: error.message,
      });
    }
  }
  // Update own profile
  async updateProfile(req, res) {
    try {
      const { name, email } = req.body;

      // Check that at least one field is provided
      if (name === undefined && email === undefined) {
        return res.status(400).json({
          message: "Provide name or email to update",
        });
      }

      // Validate fields
      if (
        (name !== undefined && (typeof name !== "string" || !name.trim())) ||
        (email !== undefined && (typeof email !== "string" || !email.trim()))
      ) {
        return res.status(400).json({
          message: "Name and email must be valid strings",
        });
      }

      const user = await userService.updateProfile(req.user.id, req.body);

      if (!user) {
        return res.status(404).json({
          message: "User not found",
        });
      }

      return res.status(200).json({
        message: "Profile updated successfully",
        user,
      });
    } catch (error) {
      if (error.code === 11000) {
        return res.status(409).json({
          message: "Email already registered",
        });
      }

      if (error.name === "ValidationError") {
        return res.status(400).json({
          message: error.message,
        });
      }

      return res.status(500).json({
        message: "Failed to update profile",
        error: error.message,
      });
    }
  }
  // Update student profile (Teacher only)
  async updateStudent(req, res) {
    try {
      const { id } = req.params;
      const { name, email } = req.body;

      if (name === undefined && email === undefined) {
        return res.status(400).json({
          message: "Provide name or email to update",
        });
      }

      if (
        (name !== undefined && (typeof name !== "string" || !name.trim())) ||
        (email !== undefined && (typeof email !== "string" || !email.trim()))
      ) {
        return res.status(400).json({
          message: "Name and email must be valid strings",
        });
      }

      const student = await userService.updateStudent(id, req.body);

      if (!student) {
        return res.status(404).json({
          message: "Student not found",
        });
      }

      return res.status(200).json({
        message: "Student updated successfully",
        student,
      });
    } catch (error) {
      if (error.code === 11000) {
        return res.status(409).json({
          message: "Email already registered",
        });
      }

      if (error.name === "ValidationError") {
        return res.status(400).json({
          message: error.message,
        });
      }

      if (error.name === "CastError" || error.name === "BSONError") {
        return res.status(400).json({
          message: "Invalid student ID",
        });
      }

      return res.status(500).json({
        message: "Failed to update student",
        error: error.message,
      });
    }
  }
}

module.exports = new UserController();
