export const getCompletedTask = (tasks) => {
    const completedTasks = tasks.filter(task => task.isDone === true)
    return completedTasks.length;
} 