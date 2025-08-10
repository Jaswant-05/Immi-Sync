import { useRecoilValue } from 'recoil';
import { useState } from 'react';
import { 
    FileText, 
    Clock, 
    CheckCircle, 
    AlertCircle, 
    User,
    Briefcase,
    GraduationCap,
    Upload,
    MessageSquare,
    ChevronDown,
    ChevronUp
} from 'lucide-react';
import { currentApplicationAtom } from '../../Recoil/atoms/currentApplicationAtom';
import { authAtom } from '../../Recoil/atoms/authAtom';
import { Task } from '../../ui/Task'; 
import { Document } from '../../ui/Document';
import { UploadDocumentModal } from '../../ui/UploadDocumentModal'; 

export const ClientDashboard = () => {
    const activeApplication = useRecoilValue(currentApplicationAtom);
    const auth = useRecoilValue(authAtom);
    const [checklistDropdownOpen, setChecklistDropdownOpen] = useState(false);
    const [applicationDropdownOpen, setApplicationDropdownOpen] = useState(false);
    const [uploadModalOpen, setUploadModalOpen] = useState(false);
    const [selectedDocument, setSelectedDocument] = useState(null);
    const [isUpdating, setIsUpdating] = useState(false);

    const getApplicationIcon = (type) => {
        switch (type?.toLowerCase()) {
            case 'pr': return <User size={24} className="text-indigo-600" />;
            case 'work': return <Briefcase size={24} className="text-indigo-600" />;
            case 'student': return <GraduationCap size={24} className="text-indigo-600" />;
            default: return <FileText size={24} className="text-indigo-600" />;
        }
    };

    // Handler functions with backend integration
    const handleTaskComplete = async (taskId) => {
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
                alert('Task marked as completed!');
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

    const handleDocumentUpload = (document) => {
        setSelectedDocument(document);
        setUploadModalOpen(true);
    };

    const handleUploadSuccess = (updatedDocument) => {
        // Refresh the page to show updated document
        window.location.reload();
    };

    const handleDocumentView = (documentId, documentUrl) => {
        if (documentUrl) {
            window.open(documentUrl, '_blank');
        } else {
            alert('Document not available for viewing');
        }
    };

    const handleDocumentDownload = (documentId, documentUrl, documentName) => {
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

    if (!activeApplication) {
        return (
            <div className="flex flex-col w-full overflow-auto bg-gray-50 min-h-screen">
                <div className="flex items-center justify-center h-64">
                    <div className="text-center">
                        <FileText size={48} className="text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Active Application</h3>
                        <p className="text-gray-600">Please select an application to view your dashboard</p>
                    </div>
                </div>
            </div>
        );
    }

    // Use data directly from the activeApplication atom
    const checklistTasks = activeApplication.checklist?.tasks || [];
    const checklistDocuments = activeApplication.checklist?.documents || [];
    const applicationTasks = activeApplication.tasks || [];
    const applicationDocuments = activeApplication.documents || [];

    const completedChecklistTasks = checklistTasks.filter(task => task.isDone).length;
    const completedApplicationTasks = applicationTasks.filter(task => task.isDone).length;
    const totalTasks = checklistTasks.length + applicationTasks.length;
    const completedTasks = completedChecklistTasks + completedApplicationTasks;

    const uploadedChecklistDocs = checklistDocuments.filter(doc => doc.uploaded).length;
    const uploadedApplicationDocs = applicationDocuments.filter(doc => doc.uploaded).length;
    const totalDocs = checklistDocuments.length + applicationDocuments.length;
    const uploadedDocs = uploadedChecklistDocs + uploadedApplicationDocs;
    const progressPercentage = (totalTasks + totalDocs) > 0 ? Math.round(((completedTasks + uploadedDocs) / (totalTasks + totalDocs)) * 100) : 0;
    const missingDocs = totalDocs - uploadedDocs;

    return (
        <div className="flex flex-col w-full overflow-auto bg-gray-50 min-h-screen">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 px-6 py-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            {activeApplication.applicant_name}'s {activeApplication.application_type} Application
                        </h1>
                        <p className="text-gray-600 mt-1">
                            Track your application progress and manage required documents
                        </p>
                    </div>
                    <div className="mt-4 sm:mt-0 flex space-x-3">
                        <button 
                            onClick={() => handleDocumentUpload({})}
                            className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
                        >
                            <Upload size={16} className="mr-2" />
                            Upload Document
                        </button>
                        <button className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
                            <MessageSquare size={16} className="mr-2" />
                            Contact Support
                        </button>
                    </div>
                </div>
            </div>

            <div className="p-6 space-y-6">
                {/* Application Overview */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <div className="flex items-center space-x-4 mb-6">
                        <div className="p-3 bg-indigo-100 rounded-lg">
                            {getApplicationIcon(activeApplication.application_type)}
                        </div>
                        <div className="flex-1">
                            <h2 className="text-xl font-semibold text-gray-900">
                                {activeApplication.application_type} Application Overview
                            </h2>
                            <p className="text-gray-600">Application ID: {activeApplication._id?.slice(-8)}</p>
                        </div>
                        <div className="text-right">
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border bg-blue-100 text-blue-800 border-blue-200">
                                <Clock size={16} className="text-blue-600 mr-2" />
                                <span>{activeApplication.application_status?.replace('_', ' ') || 'In Progress'}</span>
                            </span>
                        </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-6">
                        <div className="flex justify-between text-sm text-gray-600 mb-2">
                            <span>Overall Progress</span>
                            <span>{progressPercentage}% Complete</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                            <div 
                                className="bg-indigo-600 h-3 rounded-full transition-all duration-300" 
                                style={{ width: `${progressPercentage}%` }}
                            ></div>
                        </div>
                        <p className="text-sm text-gray-600 mt-2">
                            {(completedTasks + uploadedDocs)} of {(totalTasks + totalDocs)} checklist items completed
                        </p>
                    </div>

                    {/* Quick Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                            <div className="flex items-center space-x-3">
                                <CheckCircle size={20} className="text-green-600" />
                                <div>
                                    <p className="text-sm text-green-600">Uploaded Documents</p>
                                    <p className="text-lg font-semibold text-green-900">{uploadedDocs}</p>
                                </div>
                            </div>
                        </div>
                        <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                            <div className="flex items-center space-x-3">
                                <AlertCircle size={20} className="text-red-600" />
                                <div>
                                    <p className="text-sm text-red-600">Missing Documents</p>
                                    <p className="text-lg font-semibold text-red-900">{missingDocs}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Checklist Section */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <button
                        onClick={() => setChecklistDropdownOpen(!checklistDropdownOpen)}
                        className="w-full flex items-center justify-between mb-4 hover:bg-gray-50 p-2 rounded-lg transition-colors"
                    >
                        <div className="flex items-center space-x-3">
                            <CheckCircle size={20} className="text-indigo-600" />
                            <h3 className="text-lg font-semibold text-gray-900">Checklist Items</h3>
                            <span className="text-sm text-gray-600">
                                ({completedChecklistTasks}/{checklistTasks.length} tasks, {uploadedChecklistDocs}/{checklistDocuments.length} documents)
                            </span>
                        </div>
                        {checklistDropdownOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </button>

                    {checklistDropdownOpen && (
                        <div className="space-y-4">
                            {/* Checklist Tasks */}
                            {checklistTasks.length > 0 && (
                                <div>
                                    <h4 className="font-medium text-gray-900 mb-3">Tasks</h4>
                                    <div className="space-y-2">
                                        {checklistTasks.map((task, index) => (
                                            <Task 
                                                key={task._id || index}
                                                task={task}
                                                onMarkComplete={handleTaskComplete}
                                                showCompleteButton={!isUpdating}
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Checklist Documents */}
                            {checklistDocuments.length > 0 && (
                                <div>
                                    <h4 className="font-medium text-gray-900 mb-3">Documents</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {checklistDocuments.map((doc, index) => (
                                            <Document 
                                                key={doc._id || index}
                                                document={doc}
                                                onUpload={handleDocumentUpload}
                                                onView={handleDocumentView}
                                                onDownload={handleDocumentDownload}
                                                showUploadButton={true}
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}

                            {checklistTasks.length === 0 && checklistDocuments.length === 0 && (
                                <p className="text-gray-500 text-center py-4">No checklist items assigned yet</p>
                            )}
                        </div>
                    )}
                </div>

                {/* Application Section */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <button
                        onClick={() => setApplicationDropdownOpen(!applicationDropdownOpen)}
                        className="w-full flex items-center justify-between mb-4 hover:bg-gray-50 p-2 rounded-lg transition-colors"
                    >
                        <div className="flex items-center space-x-3">
                            <FileText size={20} className="text-indigo-600" />
                            <h3 className="text-lg font-semibold text-gray-900">Application Items</h3>
                            <span className="text-sm text-gray-600">
                                ({completedApplicationTasks}/{applicationTasks.length} tasks, {uploadedApplicationDocs}/{applicationDocuments.length} documents)
                            </span>
                        </div>
                        {applicationDropdownOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </button>

                    {applicationDropdownOpen && (
                        <div className="space-y-4">
                            {/* Application Tasks */}
                            {applicationTasks.length > 0 && (
                                <div>
                                    <h4 className="font-medium text-gray-900 mb-3">Tasks</h4>
                                    <div className="space-y-2">
                                        {applicationTasks.map((task, index) => (
                                            <Task 
                                                key={task._id || index}
                                                task={task}
                                                onMarkComplete={handleTaskComplete}
                                                showCompleteButton={!isUpdating}
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Application Documents */}
                            {applicationDocuments.length > 0 && (
                                <div>
                                    <div className="flex items-center justify-between mb-3">
                                        <h4 className="font-medium text-gray-900">Documents</h4>
                                        <button 
                                            onClick={() => handleDocumentUpload({})}
                                            className="inline-flex items-center px-3 py-1 bg-indigo-600 text-white rounded text-xs hover:bg-indigo-700 transition-colors"
                                        >
                                            <Upload size={12} className="mr-1" />
                                            Upload Document
                                        </button>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {applicationDocuments.map((doc, index) => (
                                            <Document 
                                                key={doc._id || index}
                                                document={doc}
                                                onUpload={handleDocumentUpload}
                                                onView={handleDocumentView}
                                                onDownload={handleDocumentDownload}
                                                showUploadButton={true}
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}

                            {applicationTasks.length === 0 && applicationDocuments.length === 0 && (
                                <p className="text-gray-500 text-center py-4">No application items assigned yet</p>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Upload Modal */}
            <UploadDocumentModal
                isOpen={uploadModalOpen}
                onClose={() => {
                    setUploadModalOpen(false);
                    setSelectedDocument(null);
                }}
                document={selectedDocument}
                onUploadSuccess={handleUploadSuccess}
            />

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
    );
};