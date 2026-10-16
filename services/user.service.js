const User = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

class UserService {
  // Student and Teacher Signup
  async signup(userData) {
    const { name, email, password, role } = userData;

    // Check whether email already exists
    const existingUser = await User.findOne({
      email: email.toLowerCase(),
    });

    if (existingUser) {
      throw new Error("Email already registered");
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      role,
    });

    // Remove password from response
    const userObject = user.toObject();
    delete userObject.password;

    return userObject;
  }

  // User Login
  async login(email, password) {
    // Find active user by email
    const user = await User.findOne({
      email: email.toLowerCase(),
      isActive: true,
    });

    // Check user exists
    if (!user) {
      throw new Error("Invalid email or password");
    }

    // Compare entered password with hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new Error("Invalid email or password");
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        id: user._id.toString(),
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      },
    );

    // Return token and user details
    return {
      token: token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  }
  // Get all students
  async getAllStudents() {
    const students = await User.find({
      role: "Student",
      isActive: true,
    }).select("-password");

    return students;
  }
  // Get student by ID
  async getStudentById(id) {
    const student = await User.findOne({
      _id: id,
      role: "Student",
      isActive: true,
    }).select("-password");

    return student;
  }
  // Get all students
  async getAllStudents() {
    const students = await User.find({
      role: "Student",
      isActive: true,
    }).select("-password");

    return students;
  }
  // Get all teachers
  async getAllTeachers() {
    const teachers = await User.find({
      role: "Teacher",
      isActive: true,
    }).select("-password");

    return teachers;
  }
  // Get teacher by ID
  async getTeacherById(id) {
    const teacher = await User.findOne({
      _id: id,
      role: "Teacher",
      isActive: true,
    }).select("-password");

    return teacher;
  }
  // Update own profile
  async updateProfile(userId, userData) {
    const { name, email } = userData;

    const updateData = {};

    if (name !== undefined) {
      updateData.name = name.trim();
    }

    if (email !== undefined) {
      updateData.email = email.trim().toLowerCase();
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { $set: updateData },
      {
        new: true,
        runValidators: true,
      },
    ).select("-password");

    return user;
  }
  // Update student profile (Teacher only)
  async updateStudent(studentId, userData) {
    const { name, email } = userData;

    const updateData = {};

    if (name !== undefined) {
      updateData.name = name.trim();
    }

    if (email !== undefined) {
      updateData.email = email.trim().toLowerCase();
    }

    const student = await User.findOneAndUpdate(
      {
        _id: studentId,
        role: "Student",
        isActive: true,
      },
      { $set: updateData },
      {
        new: true,
        runValidators: true,
      },
    ).select("-password");

    return student;
  }
}

module.exports = new UserService();
