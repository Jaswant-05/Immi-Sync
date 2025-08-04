import { useRecoilValue } from "recoil";
import { currentApplicationAtom } from "../../Recoil/atoms/currentApplicationAtom";
import { useMemo, useState } from "react";
import { Task } from "../../ui/Task";
import { CheckSquare, ListTodo } from "lucide-react";
import { authAtom } from "../../Recoil/atoms/authAtom";

export const ClientTasks = () => {
    const activeApplication = useRecoilValue(currentApplicationAtom);
    const auth = useRecoilValue(authAtom);
    const [isUpdating, setIsUpdating] = useState(false);
    
    const checklistTasks = useMemo(() => {
        return activeApplication?.checklist?.tasks || [];
    }, [activeApplication]);

    const applicationTasks = useMemo(() => {
        return activeApplication?.tasks || [];
    }, [activeApplication]);

    const handleMarkComplete = async (taskId) => {
        if (isUpdating) return;
        
        setIsUpdating(true);
        
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/tasks/${taskId}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${auth.token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ 
                    isDone: true,
                    updatedAt: new Date().toISOString()
                })
            });
            
            const result = await response.json();
            
            if (result.success) {
                window.location.reload(); 
            } else {
                alert('Failed to update task: ' + result.message);
            }
        } catch (error) {
            console.error('Update error:', error);
            alert('Failed to update task. Please try again.');
        } finally {
            setIsUpdating(false);
        }
    };

    if (!activeApplication) {
        return (
            <div className="flex flex-col w-full overflow-auto bg-gray-50 min-h-screen">
                <div className="flex items-center justify-center h-64">
                    <div className="text-center">
                        <ListTodo size={48} className="text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Active Application</h3>
                        <p className="text-gray-600">Please select an application to view tasks</p>
                    </div>
                </div>
            </div>
        );
    }

    // Calculate stats
    const checklistCompletedTasks = checklistTasks.filter(task => task.isDone).length;
    const applicationCompletedTasks = applicationTasks.filter(task => task.isDone).length;
    const totalChecklistTasks = checklistTasks.length;
    const totalApplicationTasks = applicationTasks.length;

    return (
        <div className="flex flex-col w-full overflow-auto bg-gray-50 min-h-screen">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 px-6 py-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            Tasks - {activeApplication.applicant_name}
                        </h1>
                        <p className="text-gray-600 mt-1">
                            Track and complete required tasks for your {activeApplication.application_type} application
                        </p>
                    </div>
                    <div className="mt-4 sm:mt-0">
                        <div className="flex items-center space-x-4 text-sm">
                            <div className="flex items-center space-x-2">
                                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                <span className="text-gray-600">
                                    {checklistCompletedTasks + applicationCompletedTasks} Completed
                                </span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                                <span className="text-gray-600">
                                    {(totalChecklistTasks + totalApplicationTasks) - (checklistCompletedTasks + applicationCompletedTasks)} Pending
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="p-6 space-y-6">
                {/* Overall Progress */}
                {(totalChecklistTasks > 0 || totalApplicationTasks > 0) && (
                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-900">Overall Progress</h3>
                            <span className="text-sm text-gray-600">
                                {Math.round(((checklistCompletedTasks + applicationCompletedTasks) / (totalChecklistTasks + totalApplicationTasks)) * 100)}% Complete
                            </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                            <div 
                                className="bg-indigo-600 h-3 rounded-full transition-all duration-300" 
                                style={{ 
                                    width: `${((checklistCompletedTasks + applicationCompletedTasks) / (totalChecklistTasks + totalApplicationTasks)) * 100}%` 
                                }}
                            ></div>
                        </div>
                        <p className="text-sm text-gray-600 mt-2">
                            {checklistCompletedTasks + applicationCompletedTasks} of {totalChecklistTasks + totalApplicationTasks} tasks completed
                        </p>
                    </div>
                )}

                {/* Checklist Tasks Section */}
                {checklistTasks.length > 0 && (
                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
                                <CheckSquare size={20} className="text-indigo-600" />
                                <span>Checklist Tasks</span>
                            </h3>
                            <span className="text-sm text-gray-600">
                                {checklistCompletedTasks}/{totalChecklistTasks} completed
                            </span>
                        </div>
                        <div className="space-y-3">
                            {checklistTasks.map((task, index) => (
                                <Task 
                                    key={task._id || index} 
                                    task={task} 
                                    onMarkComplete={handleMarkComplete}
                                    showCompleteButton={!isUpdating}
                                />
                            ))}
                        </div>
                    </div>
                )}

                {/* Application Tasks Section */}
                {applicationTasks.length > 0 && (
                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
                                <ListTodo size={20} className="text-indigo-600" />
                                <span>Application Tasks</span>
                            </h3>
                            <span className="text-sm text-gray-600">
                                {applicationCompletedTasks}/{totalApplicationTasks} completed
                            </span>
                        </div>
                        <div className="space-y-3">
                            {applicationTasks.map((task, index) => (
                                <Task
                                    key={task._id || index} 
                                    task={task} 
                                    onMarkComplete={handleMarkComplete}
                                    showCompleteButton={!isUpdating}
                                />
                            ))}
                        </div>
                    </div>
                )}

                {/* No Tasks State */}
                {checklistTasks.length === 0 && applicationTasks.length === 0 && (
                    <div className="bg-white rounded-lg border border-gray-200 p-12">
                        <div className="text-center">
                            <ListTodo size={64} className="text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Tasks Available</h3>
                            <p className="text-gray-600">
                                No tasks have been assigned to this application yet. 
                                Check back later or contact support for assistance.
                            </p>
                        </div>
                    </div>
                )}

                {/* Loading State */}
                {isUpdating && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-lg p-6 flex items-center space-x-3">
                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-500"></div>
                            <span className="text-gray-900">Updating task...</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};