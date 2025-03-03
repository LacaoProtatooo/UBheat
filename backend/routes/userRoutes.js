import express from 'express';
import User from '../models/User.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const users = await User.find({}, 'firstName lastName email isActive'); // Fetch users with selected fields
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users' });
  }
});

// Update user status
router.patch('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).send('User not found');
    }

    user.isActive = req.body.isActive;
    await user.save();
    res.send(user);
  } catch (error) {
    res.status(500).send('Error updating user status');
  }
});

export default router;