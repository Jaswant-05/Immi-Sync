const Task = require("../models/Task");

const taskService = {
    async createTask(params) {
        try {
            const { userId, consultancyId, title, description, checklistId } = params;

            const taskData = {
                user: userId,
                consultancy: consultancyId,
                title,
                description,
                isDone: false,
            };

            if (checklistId) {
                taskData.checklist = checklistId;
            }

            const newTask = await Task.create(taskData);
            return { success: true, newTask };

        } catch(err) {
            throw new Error(`Error in creating a Task: ${err.message}`);
        }
    },
    async updateTask(params) {
    try {
        const { taskId, title, description, isDone, checklistId } = params;

        const updateData = {};
        if (title !== undefined) updateData.title = title;
        if (description !== undefined) updateData.description = description;
        if (isDone !== undefined) updateData.isDone = isDone;
        if (checklistId !== undefined) updateData.checklist = checklistId;

        const updatedTask = await Task.findByIdAndUpdate(taskId, updateData, { new: true });

        if (!updatedTask) {
            return { success: false, message: "Task not found" };
        }

        return { success: true, updatedTask };
    } catch (err) {
        throw new Error(`Error in updating Task: ${err.message}`);
    }
    },

    async getTask({ taskId }){
        try{

            const task = await Task.findOne({ _id: taskId});
            return ({
                success: true,
                task
            });

        } catch(err) {
            throw new Error(`Error in Fetching Task from DB ${err.message}`);
        }
    },
    async deleteTask({ taskId }){
        try{

            await Task.deleteOne({ _id : taskId });
            return ({ success: true, message: "Successfully Deleted Tasks"});

        } catch(err) {
            throw new Error(`Error in Deleting Task ${err.message}`);
        }
    },
};

module.exports = taskService;