import express from 'express';
import {
  createUser,
  getUsers,
  deleteUser,
  updateUser,
  updateUserStatus,
  updateUserRole
} from '../controllers/users.controller.js';

const router = express.Router();

// Route to create a new user
router.post('/users', createUser);

// Route to get all users with pagination
router.get('/users', getUsers);

// Route to update a specific user by ID
router.put('/users/:id', updateUser);

// Route to delete a specific user by ID
router.delete('/users/:id', deleteUser);

// Route to update user verification status by ID
router.put('/users/:id/status', updateUserStatus);

// Route to update user role by ID
router.put('/users/:id/role', updateUserRole);

export default router;

