import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";


export const createUser = async (req, res) => {
  let { email, password, name } = req.body;

  try {
    if (!email || !password || !name) {
      return res.status(400).json({ success: false, message: "Username, email, and password are required" });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ success: false, message: "Invalid email format" });
    }

    // Define password criteria
    const criteria = [
      { label: "At least 6 characters", met: password.length >= 6 },
      { label: "Contains uppercase letter", met: /[A-Z]/.test(password) },
      { label: "Contains lowercase letter", met: /[a-z]/.test(password) },
      { label: "Contains a number", met: /\d/.test(password) },
      { label: "Contains special character", met: /[^A-Za-z0-9]/.test(password) },
    ];

    // Check if all criteria are met
    const unmetCriteria = criteria.filter(c => !c.met);
    if (unmetCriteria.length > 0) {
      const messages = unmetCriteria.map(c => c.label);
      return res.status(400).json({ 
        success: false, 
        message: `Password does not meet the following criteria: ${messages.join(", ")}` 
      });
    }

    // Check if the user already exists
    const userExists = await User.findOne({ where: { email } });
    if (userExists) {
      return res.status(400).json({ success: false, message: "User already exists" });
    }

    // Hash the password
    const hashedPassword = await bcryptjs.hash(password, 10);

    // Create a new user with isVerified set to false and default role
    const newUser = await User.create({ 
      email, 
      password: hashedPassword, 
      name, 
      isVerified: false, 
      role: "User"
    });

    res.status(201).json({
      success: true,
      message: "User created successfully",
      user: { id: newUser.id, email: newUser.email, name: newUser.name, role: newUser.role, isVerified: newUser.isVerified },
    });
  } catch (error) {
    console.error("Error in createUser: ", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


// GET /api/users
export const getUsers = async (req, res) => {
  const { page = 1, limit = 25 } = req.query;
  const offset = (page - 1) * limit;

  try {
    const users = await User.findAll({
      limit: parseInt(limit),
      offset: parseInt(offset),
      attributes: { exclude: ["password"] }, // Exclude password from response
      order: [["name", "ASC"]],
    });
    res.status(200).json({ users });
  } catch (error) {
    console.error("Error fetching users: ", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// DELETE /api/users/:id
export const deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    // Check if the user exists
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Delete the user
    await user.destroy();

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error("Error in deleteUser: ", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// UPDATE /api/users/:id
export const updateUser = async (req, res) => {
  const { id } = req.params;
  let { email, name, password } = req.body;

  try {
    // Check if the user exists
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Validate email format if email is provided
    if (email && email !== user.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ success: false, message: "Invalid email format" });
      }

      // Check if a user with the new email already exists
      const userExists = await User.findOne({ where: { email } });
      if (userExists) {
        return res.status(400).json({ success: false, message: "Email already in use" });
      }
      user.email = email;
    }

    // Validate password criteria if password is provided
    if (password) {
      const criteria = [
        { label: "At least 6 characters", met: password.length >= 6 },
        { label: "Contains uppercase letter", met: /[A-Z]/.test(password) },
        { label: "Contains lowercase letter", met: /[a-z]/.test(password) },
        { label: "Contains a number", met: /\d/.test(password) },
        { label: "Contains special character", met: /[^A-Za-z0-9]/.test(password) },
      ];

      // Check if all criteria are met
      const unmetCriteria = criteria.filter(c => !c.met);
      if (unmetCriteria.length > 0) {
        const messages = unmetCriteria.map(c => c.label);
        return res.status(400).json({
          success: false,
          message: `Password does not meet the following criteria: ${messages.join(", ")}`
        });
      }

      // Hash the password
      const hashedPassword = await bcryptjs.hash(password, 10);
      user.password = hashedPassword;
    }

    // Update name if provided
    if (name) user.name = name;

    await user.save();

    res.status(200).json({
      success: true,
      message: "User updated successfully",
      user: { id: user.id, email: user.email, name: user.name },
    });
  } catch (error) {
    console.error("Error in updateUser: ", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


// UPDATE /api/users/:id/status
export const updateUserStatus = async (req, res) => {
    const { id } = req.params;
    const { isVerified } = req.body;
  
    try {
      // Check if the user exists
      const user = await User.findByPk(id);
      if (!user) {
        return res.status(404).json({ success: false, message: "User not found" });
      }
  
      // Update the isVerified status
      user.isVerified = isVerified;
      await user.save();
  
      res.status(200).json({
        success: true,
        message: "User status updated successfully",
        user: { id: user.id, email: user.email, name: user.name, isVerified: user.isVerified },
      });
    } catch (error) {
      console.error("Error in updateUserStatus: ", error);
      res.status(500).json({ success: false, message: "Server error" });
    }
  };
  
  // UPDATE /api/users/:id/role
  export const updateUserRole = async (req, res) => {
    const { id } = req.params;
    const { role } = req.body;
  
    try {
      // Check if the user exists
      const user = await User.findByPk(id);
      if (!user) {
        return res.status(404).json({ success: false, message: "User not found" });
      }
  
      // Update the role
      user.role = role;
      await user.save();
  
      res.status(200).json({
        success: true,
        message: "User role updated successfully",
        user: { id: user.id, email: user.email, name: user.name, role: user.role },
      });
    } catch (error) {
      console.error("Error in updateUserRole: ", error);
      res.status(500).json({ success: false, message: "Server error" });
    }
  };
  
