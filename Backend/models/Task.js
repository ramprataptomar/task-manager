const mongoose = require('mongoose');

const todoSchema = new mongoose.Schema(
    {
        text: {
            type: String,
            required: true,
        },
        completed: {
            type: Boolean,
            default: false,
        }
    }
)

const TaskSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        priority: {
            type: String,
            enum: ['Low', 'Medium', 'High'],
            default: 'Medium',
        },
        status: {
            type: String,
            enum: ['Todo', 'In Progress', 'Completed'],
            default: 'Todo',
        },
        dueDate: {
            type: Date,
            required: true,
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        assignedTo: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        }],
        attachments: [{
            type: String,
        }],
        todoCheckList: [todoSchema],
        progress: {
            type: Number,
            default: 0,
        }
    },
    {
        timestamps: true,
    }
)

module.exports = mongoose.model('Task', TaskSchema);