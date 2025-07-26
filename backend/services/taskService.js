const Application = require("../models/Application");
const Checklist = require("../models/Checklist");
const Task = require("../models/Task");

const taskService = {
    async createTask(params) {
        try {
            const { user, consultancy, title, description, checklist, application } = params;

            const taskData = {
                user,
                consultancy,
                title,
                description,
                isDone: false,
                application
            };

            if (checklist) {
                taskData.checklist = checklist;
            }
            console.log("here")
            const newTask = await Task.create(taskData);
            console.log(newTask);
            if (application) {
                await Application.findByIdAndUpdate(application, {
                    $addToSet: { tasks: newTask._id }
                });
            }

            if(checklist){
                 await Checklist.findByIdAndUpdate(checklist, {
                    $addToSet: { tasks: newTask._id }
                });
            }

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
            const task = await Task.findOne({_id : taskId});

            if (task.application) {
                await Application.findByIdAndUpdate(task.application, {
                    $pull: { tasks: task._id }
                });
            }

            if (task.checklist) {
                await Checklist.findByIdAndUpdate(task.checklist, {
                    $pull: { tasks: task._id }
                });
            }

            await Task.deleteOne({ _id : taskId });
            return ({ success: true, message: "Successfully Deleted Tasks"});

        } catch(err) {
            throw new Error(`Error in Deleting Task ${err.message}`);
        }
    },
};

module.exports = taskService;