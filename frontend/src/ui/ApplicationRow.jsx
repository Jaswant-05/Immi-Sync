import { Calendar, CheckCircle2, Edit, Eye, MoreHorizontal, User } from "lucide-react";

export const ApplicationRow = ({ 
    application, 
    onView, 
    onEdit, 
    getStatusBadge 
}) => {
    const getChecklistProgress = (application) => {
        if (application.tasks_count === 0 || !application.tasks_count) {
            return (
                <div className="flex items-center">
                    <span className="text-sm text-gray-500 italic">None</span>
                </div>
            );  
        }

        const progress = (application.tasks_completed / application.tasks_count) * 100;
        const isComplete = application.tasks_completed === application.tasks_count;

        return (
            <div className="flex items-center space-x-2">
                <div className="flex items-center">
                    <CheckCircle2
                        size={16}
                        className={`mr-1 ${isComplete ? 'text-green-600' : 'text-gray-400'}`}
                    />
                    <span className="text-sm text-gray-900">
                        {application.tasks_completed}/{application.tasks_count}
                    </span>
                </div>
                <div className="w-16 bg-gray-200 rounded-full h-2">
                    <div
                        className={`h-2 rounded-full transition-all ${
                            isComplete ? 'bg-green-500' : 'bg-indigo-500'
                        }`}
                        style={{ width: `${progress}%` }}
                    />
                </div>
            </div>
        );
    };

    return (
        <tr key={application.id} className="hover:bg-gray-50 transition-colors">
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                            <User size={16} className="text-indigo-600" />
                        </div>
                    </div>
                    <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{application.applicant_name}</div>
                        <div className="text-sm text-gray-500">{application.applicant_email}</div>
                    </div>
                </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                    {application.application_type}
                </span>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                {getStatusBadge(application.application_status)}
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                {getChecklistProgress(application)}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <div className="flex items-center">
                    <Calendar size={14} className="mr-1" />
                    {new Date(application.updated_date).toLocaleDateString()}
                </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div className="flex items-center space-x-2">
                    <button
                        onClick={() => onView(application)}
                        className="text-indigo-600 hover:text-indigo-900 transition-colors"
                        title="View Details"
                    >
                        <Eye size={16} />
                    </button>
                    <button
                        onClick={() => onEdit(application)}
                        className="text-gray-600 hover:text-gray-900 transition-colors"
                        title="Edit Application"
                    >
                        <Edit size={16} />
                    </button>
                    <button 
                        className="text-gray-600 hover:text-gray-900 transition-colors"
                        title="More Options"
                    >
                        <MoreHorizontal size={16} />
                    </button>
                </div>
            </td>
        </tr>
    );
};