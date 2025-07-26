import { useState } from "react";
import { 
  XCircle, 
  CheckSquare, 
  FileText, 
  Edit, 
  User, 
  Calendar,
  Eye,
  Check,
  Clock,
  AlertCircle
} from "lucide-react";

export const ChecklistDetailsModal = ({ isOpen, onClose, checklist, onEdit }) => {
  const [activeTab, setActiveTab] = useState('overview');

  if (!isOpen || !checklist) return null;

  const documents = checklist.documents || [];
  const tasks = checklist.tasks || [];
  
  // Calculate progress metrics
  const completedTasks = tasks.filter(task => task.completed || task.isDone).length;
  const uploadedDocs = documents.filter(doc => doc.uploaded).length;
  const totalTasks = tasks.length;
  const totalDocs = documents.length;
  
  const taskProgress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
  const docProgress = totalDocs > 0 ? (uploadedDocs / totalDocs) * 100 : 0;
  const overallProgress = totalTasks + totalDocs > 0 ? 
    ((completedTasks + uploadedDocs) / (totalTasks + totalDocs)) * 100 : 0;

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      'Active': { color: 'bg-blue-100 text-blue-800', icon: Clock },
      'Completed': { color: 'bg-green-100 text-green-800', icon: Check },
      'Draft': { color: 'bg-gray-100 text-gray-800', icon: AlertCircle },
      'Archived': { color: 'bg-red-100 text-red-800', icon: XCircle }
    };

    const config = statusConfig[status] || statusConfig['Draft'];
    const IconComponent = config.icon;

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        <IconComponent size={12} className="mr-1" />
        {status}
      </span>
    );
  };

  const handleEditClick = () => {
    onClose();
    if (onEdit) {
      onEdit(checklist);
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Eye },
    { id: 'documents', label: `Documents (${uploadedDocs}/${totalDocs})`, icon: FileText },
    { id: 'tasks', label: `Tasks (${completedTasks}/${totalTasks})`, icon: CheckSquare }
  ];

  return (
    <div className="fixed inset-0 backdrop-blur-sm backdrop-brightness-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-indigo-100 rounded-lg">
                <CheckSquare size={20} className="text-indigo-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  {checklist.name || 'Checklist Details'}
                </h2>
                <p className="text-sm text-gray-600">
                  {checklist.description || 
                   (checklist.user_name ? `${checklist.user_name}'s Checklist` : 'Template Checklist')}
                </p>
              </div>
              {checklist.status && (
                <div>{getStatusBadge(checklist.status)}</div>
              )}
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <XCircle size={24} />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex px-6">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon size={16} />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Progress Overview */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Progress Overview</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  {/* Overall Progress */}
                  <div className="bg-indigo-50 p-4 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-indigo-900">Overall Progress</h4>
                      <span className="text-2xl font-bold text-indigo-600">
                        {Math.round(overallProgress)}%
                      </span>
                    </div>
                    <div className="w-full bg-indigo-200 rounded-full h-2">
                      <div 
                        className="bg-indigo-600 h-2 rounded-full transition-all"
                        style={{ width: `${overallProgress}%` }}
                      />
                    </div>
                  </div>

                  {/* Task Progress */}
                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-green-900">Tasks</h4>
                      <span className="text-lg font-bold text-green-600">
                        {completedTasks}/{totalTasks}
                      </span>
                    </div>
                    <div className="w-full bg-green-200 rounded-full h-2">
                      <div 
                        className="bg-green-600 h-2 rounded-full transition-all"
                        style={{ width: `${taskProgress}%` }}
                      />
                    </div>
                  </div>

                  {/* Document Progress */}
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-blue-900">Documents</h4>
                      <span className="text-lg font-bold text-blue-600">
                        {uploadedDocs}/{totalDocs}
                      </span>
                    </div>
                    <div className="w-full bg-blue-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all"
                        style={{ width: `${docProgress}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Checklist Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <CheckSquare size={18} />
                    Checklist Information
                  </h3>
                  <div className="space-y-3 bg-gray-50 p-4 rounded-lg">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Name</label>
                      <p className="text-sm text-gray-900">{checklist.name || 'Unnamed Checklist'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Application Type</label>
                      <p className="text-sm text-gray-900">
                        {checklist.application_type === 'other' ? 'General' : (checklist.application_type || 'N/A')}
                      </p>
                    </div>
                    {checklist.user_name && (
                      <div>
                        <label className="text-sm font-medium text-gray-500">Assigned User</label>
                        <p className="text-sm text-gray-900">{checklist.user_name}</p>
                      </div>
                    )}
                    {checklist.application_name && (
                      <div>
                        <label className="text-sm font-medium text-gray-500">Application</label>
                        <p className="text-sm text-gray-900">{checklist.application_name}</p>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Calendar size={18} />
                    Timeline
                  </h3>
                  <div className="space-y-3 bg-gray-50 p-4 rounded-lg">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Created</label>
                      <p className="text-sm text-gray-900">
                        {formatDate(checklist.createdAt || checklist.created_date)}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Last Updated</label>
                      <p className="text-sm text-gray-900">
                        {formatDate(checklist.updatedAt || checklist.updated_date)}
                      </p>
                    </div>
                    {checklist.created_by && (
                      <div>
                        <label className="text-sm font-medium text-gray-500">Created By</label>
                        <p className="text-sm text-gray-900">{checklist.created_by}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'documents' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Documents</h3>
                <div className="text-sm text-gray-600">
                  {uploadedDocs} of {totalDocs} documents uploaded
                </div>
              </div>
              
              {documents.length > 0 ? (
                <div className="space-y-3">
                  {documents.map((doc, index) => (
                    <div key={doc._id || doc.id || index} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${doc.uploaded ? 'bg-green-100' : 'bg-gray-100'}`}>
                            <FileText size={20} className={doc.uploaded ? 'text-green-600' : 'text-gray-500'} />
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900">{doc.name}</h4>
                            {doc.gcs_file_name && (
                              <p className="text-sm text-gray-500">File: {doc.gcs_file_name}</p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {doc.uploaded ? (
                            <span className="flex items-center gap-1 text-green-600 text-sm">
                              <Check size={16} />
                              Uploaded
                            </span>
                          ) : (
                            <span className="flex items-center gap-1 text-gray-500 text-sm">
                              <Clock size={16} />
                              Pending
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <FileText size={48} className="mx-auto mb-2 text-gray-400" />
                  <p>No documents in this checklist</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'tasks' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Tasks</h3>
                <div className="text-sm text-gray-600">
                  {completedTasks} of {totalTasks} tasks completed
                </div>
              </div>
              
              {tasks.length > 0 ? (
                <div className="space-y-3">
                  {tasks.map((task, index) => (
                    <div key={task._id || task.id || index} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          <div className={`p-2 rounded-lg mt-1 ${(task.completed || task.isDone) ? 'bg-green-100' : 'bg-gray-100'}`}>
                            <CheckSquare size={20} className={(task.completed || task.isDone) ? 'text-green-600' : 'text-gray-500'} />
                          </div>
                          <div>
                            <h4 className={`font-medium ${(task.completed || task.isDone) ? 'text-gray-500 line-through' : 'text-gray-900'}`}>
                              {task.title || task.name}
                            </h4>
                            {task.description && (
                              <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                            )}
                            {(task.updatedAt || task.completedAt) && (
                              <p className="text-xs text-gray-400 mt-1">
                                Last updated: {formatDate(task.updatedAt || task.completedAt)}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {(task.completed || task.isDone) ? (
                            <span className="flex items-center gap-1 text-green-600 text-sm">
                              <Check size={16} />
                              Complete
                            </span>
                          ) : (
                            <span className="flex items-center gap-1 text-yellow-600 text-sm">
                              <Clock size={16} />
                              Pending
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <CheckSquare size={48} className="mx-auto mb-2 text-gray-400" />
                  <p>No tasks in this checklist</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-6 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Close
          </button>
          {onEdit && (
            <button 
              onClick={handleEditClick}
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors flex items-center gap-2"
            >
              <Edit size={16} />
              Edit Checklist
            </button>
          )}
        </div>
      </div>
    </div>
  );
};