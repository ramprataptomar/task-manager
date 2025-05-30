const Task = require('../models/Task');

// @desc    Get all tasks
// @route   GET /api/tasks
// @access  Private
const getTasks = async (req, res) => {
    try {
        const { status } = req.query;
        let filter = {};

        if(status) {
            filter.status = status;
        }

        let tasks;

        if(req.user.role === 'admin') {
            tasks = await Task.find(filter).populate(
                'assignedTo',
                'name email profileImageUrl'
            );
        }
        else {
            tasks = await Task.find({ ...filter, assignedTo: req.user._id }).populate(
                'assignedTo',
                'name email profileImageUrl'
            );
        }

        tasks = await Promise.all(
            tasks.map(async (task) => {
                const completedCount = task.todoCheckList.filter( item => item.completed).length;

                return { ...task._doc, completedTodoCount: completedCount };
            })
        )

        const allTasks = await Task.countDocuments(
            req.user.role === 'admin' ? {} : { assignedTo: req.user._id }
        )

        const todoTasks = await Task.countDocuments({
            ...filter,
            status: 'Todo',
            ...(req.user.role !== 'admin' && {assignedTo : req.user._id})
        });

        const inProgressTasks = await Task.countDocuments({
            ...filter,
            status: 'In Progress',
            ...(req.user.role !== 'admin' && {assignedTo : req.user._id})
        });

        const completedTasks = await Task.countDocuments({
            ...filter,
            status: 'Completed',
            ...(req.user.role !== 'admin' && {assignedTo : req.user._id})
        });

        res.status(200).json({
            tasks,
            statusSummary: {
                all: allTasks,
                todo: todoTasks,
                inProgress: inProgressTasks,
                completed: completedTasks,
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}

// @desc    Get task by ID
// @route   GET /api/tasks/:id
// @access  Private
const getTaskById = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id).populate(
            'assignedTo',
            'name email profileImageUrl'
        );

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        res.status(200).json(task);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}

// @desc    create a new task (admin only)
// @route   POST /api/tasks (admin only)
// @access  Private
const createTask = async (req, res) => {
    try {
        const { title, description, priority, dueDate, assignedTo, attachments, todoCheckList } = req.body;

        if(!Array.isArray(assignedTo)){
            return res.status(400).json({ message: 'assignedTo should be an array of id\'s' });
        }

        const task = await Task.create({
            title,
            description,
            priority,
            dueDate,
            createdBy: req.user._id,
            assignedTo,
            attachments,
            todoCheckList
        });

        res.status(201).json({ message: 'Task created successfully', task });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}

// @desc    Update task
// @route   PUT /api/task/:id
// @access  Private
const updateTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        task.title = req.body.title || task.title;
        task.description = req.body.description || task.description;
        task.priority = req.body.priority || task.priority;
        task.dueDate = req.body.dueDate || task.dueDate;
        task.todoCheckList = req.body.todoCheckList || task.todoCheckList;
        task.attachments = req.body.attachments || task.attachments;

        if(req.body.assignedTo) {
            if(!Array.isArray(req.body.assignedTo)){
                return res.status(400).json({ message: 'assignedTo should be an array of id\'s' });
            }
            task.assignedTo = req.body.assignedTo;
        }

        const updatedTask = await task.save();
        res.status(200).json({ message: 'Task updated successfully', task: updatedTask });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}

// @desc    Delete task (admin only)
// @route   DELETE /api/tasks/:id
// @access  Private
const deleteTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        await task.deleteOne();
        res.status(200).json({ message: 'Task deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}

// @desc    Update task status
// @route   PUT /api/tasks/:id/status
// @access  Private
const updateTaskStatus = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        const isAssigned = task.assignedTo.some(userId => userId.toString() === req.user._id.toString());

        if (!isAssigned && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'You are not authorized to update this task' });
        }

        task.status = req.body.status || task.status;

        if(task.status === 'Completed') {
            task.todoCheckList.forEach(item => { item.completed = true; });
            task.progress = 100;
        }

        const updatedTask = await task.save();
        res.status(200).json({ message: 'Task status updated successfully', task: updatedTask });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}

// @desc    Update task checklist
// @route   PUT /api/tasks
// @access  Private
const updateTaskChecklist = async (req, res) => {
    try {
        const { todoCheckList } = req.body;

        const task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        if(!task.assignedTo.includes(req.user._id) && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'You are not authorized to update this task checklist' });
        }

        task.todoCheckList = todoCheckList;
        
        const completedCount = todoCheckList.filter(item => item.completed).length;
        const totalCount = todoCheckList.length;
        task.progress = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

        if(task.progress === 100) {
            task.status = 'Completed';
        } else if(task.progress > 0 ) {
            task.status = 'In Progress';
        } else {
            task.status = 'Todo';
        }

        await task.save();
        const updatedTask = await Task.findById(req.params.id).populate(
            'assignedTo',
            'name email profileImageUrl'
        );

        res.status(200).json({ message: 'Task checklist updated successfully', task: updatedTask });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}

// @desc    Get dashboard data for admin
// @route   GET /api/tasks/dashboard-data
// @access  Private
const getDashboardData = async (req, res) => {
    try {
        const totalTasks = await Task.countDocuments();
        const todoTasks = await Task.countDocuments({ status: "Todo" });
        const completedTasks = await Task.countDocuments({ status: "Completed" });
        const overdueTasks = await Task.countDocuments({
            status: { $ne: "Completed" },
            dueDate: { $lt: new Date() },
        });
        
        // Ensure all possible statuses are included
        const taskStatuses = ["Todo", "In Progress", "Completed"];
        const taskDistributionRaw = await Task.aggregate([
            {
                $group: {
                    _id: "$status",
                    count: { $sum: 1 },
                },
            },
        ]);

        const taskDistribution = taskStatuses.reduce((acc, status) => {
            const formattedKey = status.replace(/\s+/g, ""); // Remove spaces for response keys
            acc[formattedKey] = taskDistributionRaw.find((item) => item._id === status)?.count || 0;
            return acc;
        }, {});

        taskDistribution["All"] = totalTasks; // Add total count to taskDistribution
        
        // Ensure all priority levels are included
        const taskPriorities = ["Low", "Medium", "High"];
        const taskPriorityLevelsRaw = await Task.aggregate ([
            {
                $group: {
                _id: "$priority",
                count: { $sum: 1 },
                },
            },
        ]);

        const taskPriorityLevels = taskPriorities.reduce((acc, priority) => {
            acc[priority] = taskPriorityLevelsRaw.find((item) => item._id === priority)?.count || 0;
            return acc;
        }, {});

        const recentTasks = await Task.find().sort({ createdAt: -1}).limit(10).select("title status priority dueDate createdAt");
        
        res.status(200).json({
            statistics: {
                totalTasks,
                todoTasks,
                completedTasks,
                overdueTasks,
            },
            charts: {
                taskDistribution,
                taskPriorityLevels,
            },
            recentTasks
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}

// @desc    GEt all tasks for user dashboard
// @route   GET /api/tasks/user-dashboard-data
// @access  Private
const getUserDashboardData = async (req, res) => {
    try {
        const userId = req.user._id; // Only fetch data for the logged-in user

        // Fetch statistics for user-specific tasks
        const totalTasks = await Task.countDocuments({ assignedTo: userId });
        const todoTasks = await Task.countDocuments({ assignedTo: userId, status: "Todo" });
        const completedTasks = await Task.countDocuments({ assignedTo: userId, status: "Completed" });
        const overdueTasks = await Task.countDocuments({
            assignedTo: userId,
            status: { $ne: "Completed" },
            dueDate: { $lt: new Date() },
        });

        // Task distribution by status
        const taskStatuses = ["Todo", "In Progress", "Completed"];
        const taskDistributionRaw = await Task.aggregate ([
            { $match: { assignedTo: userId } },
            { $group: {_id: "$status", count: { $sum: 1}}},
        ]);

        const taskDistribution = taskStatuses.reduce((acc, status) => {
            const formattedKey = status.replace(/\s+/g, "");
            acc [formattedKey] = taskDistributionRaw.find((item) => item._id === status)?.count || 0;
            return acc;
        }, {});
        taskDistribution ["All"] = totalTasks;

        // Task distribution by priority
        const taskPriorities = ["Low", "Medium", "High"];
        const taskPriorityLevelsRaw = await Task.aggregate([
            { $match: { assignedTo: userId } },
            { $group: {_id: "$priority", count: { $sum: 1 }}},
        ]);

        const taskPriorityLevels = taskPriorities.reduce((acc, priority) => {
            acc [priority] =
            taskPriorityLevelsRaw.find((item) => item._id === priority)?.count || 0;
            return acc;
        }, {});

        // Fetch recent 10 tasks for the logged-in user
        const recentTasks = await Task.find({ assignedTo: userId })
        .sort({ createdAt: -1})
        .limit(10)
        .select("title status priority dueDate createdAt");

        res.status(200).json({
            statistics: {
                totalTasks,
                todoTasks,
                completedTasks,
                overdueTasks,
            },
            charts: {
                taskDistribution,
                taskPriorityLevels,
            },
            recentTasks,
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}

module.exports = { getTasks, getTaskById, createTask, updateTask, deleteTask, updateTaskStatus, 
                   updateTaskChecklist, getDashboardData, getUserDashboardData };