import { Check, CheckCircle, Clock } from "lucide-react";

export const Task = ({ task, onMarkComplete, showCompleteButton = true }) => {
    const getStatusColor = (isDone) => {
        if (isDone) {
            return 'bg-green-100 text-green-800 border-green-200';
        } else {
            return 'bg-yellow-100 text-yellow-800 border-yellow-200';
        }
    };

    const getStatusIcon = (isDone) => {
        if (isDone) {
            return <CheckCircle size={16} className="text-green-600" />;
        } else {
            return <Clock size={16} className="text-yellow-600" />;
        }
    };

    const getStatusText = (isDone) => {
        return isDone ? 'Completed' : 'Pending';
    };

    const handleMarkComplete = () => {
        if (onMarkComplete) {
            onMarkComplete(task._id || task.id);
        }
    };

    return (
        <div className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="flex-shrink-0">
                {getStatusIcon(task.isDone)}
            </div>
            <div className="flex-1">
                <h4 className="font-medium text-gray-900">{task.title}</h4>
                {task.description && (
                    <p className="text-sm text-gray-600">{task.description}</p>
                )}
                {task.createdAt && (
                    <p className="text-sm text-gray-500">
                        Created: {new Date(task.createdAt).toLocaleDateString()}
                    </p>
                )}
                {task.updatedAt && (
                    <p className="text-sm text-gray-500">
                        Updated: {new Date(task.updatedAt).toLocaleDateString()}
                    </p>
                )}
            </div>
            <div className="flex items-center space-x-2">
                <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(task.isDone)}`}>
                    {getStatusText(task.isDone)}
                </span>
                {showCompleteButton && !task.isDone && (
                    <button
                        onClick={handleMarkComplete}
                        className="px-3 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700 transition-colors"
                    >
                        <Check size={12} className="inline mr-1" />
                        Complete
                    </button>
                )}
            </div>
        </div>
    );
};
