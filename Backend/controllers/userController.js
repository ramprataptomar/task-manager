const Task = require('../models/Task');
const User = require('../models/User');


// @desc    Get all users
// @route   GET /api/users
// @access  Private
const getUsers = async (req, res) => {
    try {
        const users = await User.find({ role: 'user'}).select('-password');

        const usersWithTaskCounts = await Promise.all(
            users.map(async (user) => {
                const todoTasks = await Task.countDocuments({
                    assignedTo: user._id,
                    status: 'Todo',
                });

                const inProgressTasks = await Task.countDocuments({
                    assignedTo: user._id,
                    status: 'In Progress',
                });

                const completedTasks = await Task.countDocuments({
                    assignedTo: user._id,
                    status: 'Completed',
                });

                return {
                    ...user._doc,
                    todoTasks,
                    inProgressTasks,
                    completedTasks
                };
            })
        );

        res.status(200).json(usersWithTaskCounts);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}


// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private
const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}

module.exports = { getUsers, getUserById };
