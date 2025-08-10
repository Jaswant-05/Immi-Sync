import { useState } from "react";
import { useRecoilValue } from 'recoil';
import { 
  XCircle, 
  FileText, 
  CheckSquare, 
  Download, 
  Upload, 
  Check, 
  Clock, 
  User,
  Mail,
  Calendar,
  Eye,
  Edit,
  ListChecks,
  AlertCircle,
  CheckCircle2
} from "lucide-react";
import { checklistByApplicationSelector } from "../Recoil/selectors/checklistSelector";

export const ApplicationDetailsModal = ({ isOpen, onClose, onEdit, application, getStatusBadge }) => {
  const [activeTab, setActiveTab] = useState('overview');
  
  const checklist = useRecoilValue(checklistByApplicationSelector(application?._id));

  if (!isOpen || !application) return null;

  const checklistDocuments = checklist?.documents || [];
  const checklistTasks = checklist?.tasks || [];
  console.log(checklistTasks);  
  const allDocuments = application.documents || [];
  const allTasks = application.tasks || [];
  console.log(allTasks)

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleDownload = (documentId, documentUrl, documentName) => {
    if (documentUrl) {
        const link = document.createElement('a');
        link.href = documentUrl;
        link.download = documentName || 'document';
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    } else {
    }
  };

  const completedTasks = allTasks.filter(task => task.completed).length;
  const uploadedDocs = allDocuments.filter(doc => doc.uploaded).length;
  const checklistCompletedTasks = checklistTasks.filter(task => task.completed).length;
  const checklistUploadedDocs = checklistDocuments.filter(doc => doc.uploaded).length;

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Eye },
    { id: 'checklist', label: 'Checklist Progress', icon: ListChecks },
    { id: 'documents', label: `Documents (${uploadedDocs}/${allDocuments.length})`, icon: FileText },
    { id: 'tasks', label: `Tasks (${completedTasks}/${allTasks.length})`, icon: CheckSquare }
  ];

  return (
    <div className="fixed inset-0 backdrop-blur-sm backdrop-brightness-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div>
                <h2 className="text-xl font-bold text-gray-900">{application.applicant_name}</h2>
                <p className="text-sm text-gray-600">{application.application_type} Application</p>
              </div>
              <div>{getStatusBadge(application.application_status)}</div>
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
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Applicant Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <User size={20} />
                  Applicant Information
                </h3>
                <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center gap-3">
                    <User size={16} className="text-gray-500" />
                    <div>
                      <label className="text-sm font-medium text-gray-500">Full Name</label>
                      <p className="text-sm text-gray-900">{application.applicant_name}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail size={16} className="text-gray-500" />
                    <div>
                      <label className="text-sm font-medium text-gray-500">Email Address</label>
                      <p className="text-sm text-gray-900">{application.applicant_email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <FileText size={16} className="text-gray-500" />
                    <div>
                      <label className="text-sm font-medium text-gray-500">Application Type</label>
                      <p className="text-sm text-gray-900">{application.application_type}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Application Status */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Calendar size={20} />
                  Application Status
                </h3>
                <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Current Status</label>
                    <div className="mt-1">{getStatusBadge(application.application_status)}</div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Created Date</label>
                    <p className="text-sm text-gray-900">{formatDate(application.createdAt || application.created_date)}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Last Updated</label>
                    <p className="text-sm text-gray-900">{formatDate(application.updatedAt || application.updated_date)}</p>
                  </div>
                </div>
              </div>

              {/* Progress Summary - Only Checklist Documents and Tasks */}
              <div className="lg:col-span-2">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Checklist Progress Summary</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-blue-900">Checklist Documents</p>
                        <p className="text-2xl font-bold text-blue-600">{checklistUploadedDocs}/{checklistDocuments.length}</p>
                        <p className="text-xs text-blue-600">Uploaded</p>
                      </div>
                      <FileText className="text-blue-500" size={32} />
                    </div>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-green-900">Checklist Tasks</p>
                        <p className="text-2xl font-bold text-green-600">{checklistCompletedTasks}/{checklistTasks.length}</p>
                        <p className="text-xs text-green-600">Completed</p>
                      </div>
                      <CheckSquare className="text-green-500" size={32} />
                    </div>
                  </div>
                </div>
                {!checklist && (
                  <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-center gap-2">
                      <AlertCircle size={16} className="text-yellow-600" />
                      <p className="text-sm text-yellow-800">No checklist assigned to this application yet.</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'checklist' && (
            <div>
              {checklist ? (
                <div className="space-y-6">
                  {/* Checklist Header */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Checklist Status</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Documents Progress</p>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-500 h-2 rounded-full transition-all"
                              style={{ width: `${checklistDocuments.length > 0 ? (checklistUploadedDocs / checklistDocuments.length) * 100 : 0}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium">{checklistUploadedDocs}/{checklistDocuments.length}</span>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Tasks Progress</p>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-green-500 h-2 rounded-full transition-all"
                              style={{ width: `${checklistTasks.length > 0 ? (checklistCompletedTasks / checklistTasks.length) * 100 : 0}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium">{checklistCompletedTasks}/{checklistTasks.length}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Checklist Documents */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <FileText size={18} />
                      Required Documents
                    </h4>
                    <div className="space-y-2">
                      {checklistDocuments.length > 0 ? (
                        checklistDocuments.map((doc) => (
                          <div key={doc._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center gap-3">
                              <div className={`p-2 rounded-lg ${doc.uploaded ? 'bg-green-100' : 'bg-gray-100'}`}>
                                <FileText size={16} className={doc.uploaded ? 'text-green-600' : 'text-gray-500'} />
                              </div>
                              <div>
                                <span className="font-medium text-gray-900">{doc.name}</span>
                                {doc.required && (
                                  <span className="ml-2 text-xs bg-red-100 text-red-800 px-2 py-1 rounded">Required</span>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              {doc.uploaded ? (
                                <span className="flex items-center gap-1 text-green-600 text-sm">
                                  <button
                                      onClick={() => handleDownload(doc._id, doc.url, doc.name)}
                                      className="px-3 py-2 bg-gray-100 text-gray-700 rounded text-xs hover:bg-gray-200 transition-colors"
                                  >
                                      <Download size={12} />
                                  </button>
                                  <CheckCircle2 size={16} />
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
                        ))
                      ) : (
                        <p className="text-gray-500 text-sm italic">No documents in checklist</p>
                      )}
                    </div>
                  </div>

                  {/* Checklist Tasks */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <CheckSquare size={18} />
                      Required Tasks
                    </h4>
                    <div className="space-y-2">
                      {checklistTasks.length > 0 ? (
                        checklistTasks.map((task) => (
                          <div key={task._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center gap-3">
                              <div className={`p-2 rounded-lg ${task.completed ? 'bg-green-100' : 'bg-gray-100'}`}>
                                <CheckSquare size={16} className={task.completed ? 'text-green-600' : 'text-gray-500'} />
                              </div>
                              <div>
                                <span className={`font-medium ${task.completed ? 'text-gray-500 line-through' : 'text-gray-900'}`}>
                                  {task.title}
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              {task.completed ? (
                                <span className="flex items-center gap-1 text-green-600 text-sm">
                                  <CheckCircle2 size={16} />
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
                        ))
                      ) : (
                        <p className="text-gray-500 text-sm italic">No tasks in checklist</p>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <ListChecks size={48} className="text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No Checklist Assigned</h3>
                  <p className="text-gray-600">This application doesn't have a checklist assigned yet.</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'documents' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">All Documents</h3>
                <div className="text-sm text-gray-600">
                  {uploadedDocs} of {allDocuments.length} documents uploaded
                </div>
              </div>
              
              <div className="space-y-3">
                {allDocuments.length > 0 ? (
                  allDocuments.map((doc) => (
                    <div key={doc._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${doc.uploaded ? 'bg-green-100' : 'bg-gray-100'}`}>
                            <FileText size={20} className={doc.uploaded ? 'text-green-600' : 'text-gray-500'} />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-medium text-gray-900">{doc.name}</h4>
                              {doc.required && (
                                <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">Required</span>
                              )}
                              <span className={`text-xs px-2 py-1 rounded ${
                                doc.source === 'checklist' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                              }`}>
                                {doc.source === 'checklist' ? 'Checklist' : 'Additional'}
                              </span>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-gray-500">
                              <span>{doc.type}</span>
                              {doc.size && <span>{doc.size}</span>}
                              {doc.uploadedAt && <span>Uploaded {formatDate(doc.uploadedAt)}</span>}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {doc.uploaded ? (
                            <>
                              <span className="flex items-center gap-1 text-green-600 text-sm">
                                <Check size={16} />
                                Uploaded
                              </span>
                              <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded">
                                <Download size={16} />
                              </button>
                            </>
                          ) : (
                            <span className="flex items-center gap-1 text-gray-500 text-sm">
                              <Clock size={16} />
                              Pending
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <FileText size={48} className="text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No documents found</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'tasks' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">All Tasks</h3>
                <div className="text-sm text-gray-600">
                  {completedTasks} of {allTasks.length} tasks completed
                </div>
              </div>
              
              <div className="space-y-3">
                {allTasks.length > 0 ? (
                  allTasks.map((task) => (
                    <div key={task._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          <div className={`p-2 rounded-lg mt-1 ${task.completed ? 'bg-green-100' : 'bg-gray-100'}`}>
                            <CheckSquare size={20} className={task.completed ? 'text-green-600' : 'text-gray-500'} />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className={`font-medium ${task.completed ? 'text-gray-500 line-through' : 'text-gray-900'}`}>
                                {task.title}
                              </h4>
                              <span className={`text-xs px-2 py-1 rounded ${
                                task.source === 'checklist' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                              }`}>
                                {task.source === 'checklist' ? 'Checklist' : 'Additional'}
                              </span>
                            </div>
                            {task.description && (
                              <p className="text-sm text-gray-600 mb-2">{task.description}</p>
                            )}
                            <div className="flex items-center gap-4 text-xs text-gray-500">
                              {task.dueDate && <span>Due: {formatDate(task.dueDate)}</span>}
                              {task.completedAt && (
                                <span>Completed: {formatDate(task.completedAt)}</span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {task.completed ? (
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
                  ))
                ) : (
                  <div className="text-center py-8">
                    <CheckSquare size={48} className="text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No tasks found</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-6 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Close
          </button>
          <button 
            onClick={() => {
              onClose();
              onEdit(application);
            }}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors flex items-center gap-2"
          >
            <Edit size={16} />
            Edit Application
          </button>
        </div>
      </div>
    </div>
  );
};