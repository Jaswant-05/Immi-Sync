import { useState, Suspense, useEffect } from 'react';
import {  useRecoilState, useRecoilStateLoadable, useRecoilValue, useSetRecoilState } from 'recoil';
import {
    Search,
    Plus,
    Eye,
    Edit,
    UserPlus,
    MoreHorizontal,
    Calendar,
    CheckSquare,
    FileText,
    XCircle,
    Delete
} from 'lucide-react';
import { ChecklistDetailsModal } from '../../modals/ChecklistDetailsModal';
import { CreateChecklistModal } from '../../modals/CreateChecklistModal';
import { EditChecklistModal } from '../../modals/EditChecklistModal';
import { AssignChecklistModal } from '../../modals/AssignChecklistModal';

import { applicationsAtom } from '../../Recoil/atoms/applicationsAtom';
import { authAtom } from '../../Recoil/atoms/authAtom';
import { checklistOperations } from '../../utils/helper/checklistHelper';
import { checklistAtom,  } from '../../Recoil/atoms/checklistAtom';

const ChecklistContent = () => {

    const [checklists , setChecklists] = useRecoilState(checklistAtom);
    const applications = useRecoilValue(applicationsAtom);
    const auth = useRecoilValue(authAtom);

    const [searchTerm, setSearchTerm] = useState('');
    const [selectedChecklist, setSelectedChecklist] = useState(null);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showAssignModal, setShowAssignModal] = useState(false);
    const [checklistToAssign, setChecklistToAssign] = useState(null);
    const [editingChecklist, setEditingChecklist] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleCreateSubmit = async (formData) => {
        setIsLoading(true);
        try {
            const result = await checklistOperations.createChecklist(auth.token, formData);
            if (result.success) {
                setChecklists(prev => {
                    const currentList = Array.isArray(prev) ? prev : [];
                    return [...currentList, result.checklist];
                });
                setEditingChecklist(result.checklist);
                setShowCreateModal(false);
                setShowEditModal(true);
            }
        } catch (error) {
            console.error('Error creating checklist:', error);
            alert('Failed to create checklist. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleEditClick = (checklist) => {
        setEditingChecklist(checklist);
        setShowEditModal(true);
    };

    const handleUpdateChecklist = async (checklistId, updateData) => {
        try {
            const result = await checklistOperations.updateChecklist(auth.token, checklistId, updateData);
            if (result.success) {
                // Update in Recoil state
                setChecklists(prev => {
                    const currentList = Array.isArray(prev) ? prev : [];
                    return currentList.map(checklist =>
                        checklist._id === checklistId
                            ? { ...checklist, ...result.checklist }
                            : checklist
                    );
                });
                setEditingChecklist(prev => ({ ...prev, ...result.checklist }));
            }
        } catch (error) {
            console.error('Error updating checklist:', error);
            alert('Failed to update checklist. Please try again.');
        }
    };

    const handleAddDocument = async (checklistId, documentData) => {
    try {
        const result = await checklistOperations.addDocument(auth.token, checklistId, documentData);
        if (result.success) {
            const updatedChecklist = result.checklist || {
                ...editingChecklist,
                documents: [...(editingChecklist.documents || []), result.document],
                documents_count: (editingChecklist.documents_count || 0) + 1
            };

            setChecklists(prev => {
                const currentList = Array.isArray(prev) ? prev : [];
                return currentList.map(checklist =>
                    checklist._id === checklistId ? updatedChecklist : checklist
                );
            });

            setEditingChecklist(updatedChecklist);
        }
    } catch (error) {
        console.error('Error adding document:', error);
        alert('Failed to add document. Please try again.');
    }
};

    const handleAddTask = async (checklistId, taskData) => {
    try {
        const result = await checklistOperations.addTask(auth.token, checklistId, taskData);
        if (result.success) {
            const updatedChecklist = result.checklist || {
                ...editingChecklist,
                tasks: [...(editingChecklist.tasks || []), result.task],
                tasks_count: (editingChecklist.tasks_count || 0) + 1
            };

            setChecklists(prev => {
                const currentList = Array.isArray(prev) ? prev : [];
                return currentList.map(checklist =>
                    checklist._id === checklistId ? updatedChecklist : checklist
                );
            });

            setEditingChecklist(updatedChecklist);
        }   
    } catch (error) {
        console.error('Error adding task:', error);
    }
};

    const handleRemoveDocument = async (checklistId, documentId) => {
        try {
            const result = await checklistOperations.removeDocument(auth.token, checklistId, documentId);
            if (result.success) {
                // Update in Recoil state
                setChecklists(prev => {
                    const currentList = Array.isArray(prev) ? prev : [];
                    return currentList.map(checklist =>
                        checklist._id === checklistId
                            ? {
                                ...checklist,
                                documents: checklist.documents?.filter(doc => doc._id !== documentId) || [],
                                documents_count: Math.max((checklist.documents_count || 1) - 1, 0)
                            }
                            : checklist
                    );
                });
                setEditingChecklist(prev => ({
                    ...prev,
                    documents: prev.documents?.filter(doc => doc._id !== documentId) || [],
                    documents_count: Math.max((prev.documents_count || 1) - 1, 0)
                }));
            }
        } catch (error) {
            console.error('Error removing document:', error);
            alert('Failed to remove document. Please try again.');
        }
    };

    const handleRemoveTask = async (checklistId, taskId) => {
        try {
            const result = await checklistOperations.removeTask(auth.token, checklistId, taskId);
            if (result.success) {
                // Update in Recoil state
                setChecklists(prev => {
                    const currentList = Array.isArray(prev) ? prev : [];
                    return currentList.map(checklist =>
                        checklist._id === checklistId
                            ? {
                                ...checklist,
                                tasks: checklist.tasks?.filter(task => task._id !== taskId) || [],
                                tasks_count: Math.max((checklist.tasks_count || 1) - 1, 0)
                            }
                            : checklist
                    );
                });
                setEditingChecklist(prev => ({
                    ...prev,
                    tasks: prev.tasks?.filter(task => task._id !== taskId) || [],
                    tasks_count: Math.max((prev.tasks_count || 1) - 1, 0)
                }));
            }
        } catch (error) {
            console.error('Error removing task:', error);
            alert('Failed to remove task. Please try again.');
        }
    };

    const handleAssignClick = (checklist) => {
        setChecklistToAssign(checklist);
        setShowAssignModal(true);
    };

    const handleAssignSubmit = async (assignmentData) => {
        try {
            const result = await checklistOperations.assignChecklist(
                auth.token,
                assignmentData.checklistId,
                assignmentData.applicationId
            );
            if (result.success) {
                setShowAssignModal(false);
                setChecklistToAssign(null);
                alert(`Checklist successfully assigned to ${assignmentData.applicationName}!`);
            }
        } catch (error) {
            console.error('Error assigning checklist:', error);
            alert('Failed to assign checklist. Please try again.');
        }
    };

    const handleDeleteChecklist = async (checklistId) => {
        if (!confirm('Are you sure you want to delete this checklist template? This action cannot be undone.')) {
            return;
        }

        try {
            const result = await checklistOperations.deleteChecklist(auth.token, checklistId);
            if (result.success) {
                // Remove from Recoil state
                setChecklists(prev => {
                    const currentList = Array.isArray(prev) ? prev : [];
                    return currentList.filter(checklist => checklist._id !== checklistId);
                });
                alert('Checklist template deleted successfully.');
            }
        } catch (error) {
            console.error('Error deleting checklist:', error);
            alert('Failed to delete checklist. Please try again.');
        }
    };

    const getTypeColor = (type) => {
        const typeColors = {
            'citizenship': 'bg-purple-100 text-purple-800',
            'Work': 'bg-blue-100 text-blue-800',
            'Visitor': 'bg-green-100 text-green-800',
            'PR': 'bg-indigo-100 text-indigo-800',
            'other': 'bg-gray-100 text-gray-800'
        };
        return typeColors[type] || 'bg-gray-100 text-gray-800';
    };

    // Filter checklists based on search and type
    const filteredChecklists = Array.isArray(checklists) ? checklists.filter(checklist => {
        const matchesSearch = checklist.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            checklist.description?.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesSearch;
    }) : [];

    return (
        <div className="flex flex-col w-full overflow-auto bg-gray-50 min-h-screen">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 px-6 py-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Checklist Templates</h1>
                        <p className="text-gray-600 mt-1">Create and manage reusable checklist templates</p>
                    </div>
                    <div className="mt-4 sm:mt-0 flex space-x-3">
                        <button
                            onClick={() => setShowCreateModal(true)}
                            disabled={isLoading}
                            className={`inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                isLoading
                                    ? 'bg-indigo-400 cursor-not-allowed'
                                    : 'bg-indigo-600 hover:bg-indigo-700'
                            } text-white`}
                        >
                            <Plus size={16} className="mr-2" />
                            New Template
                        </button>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white border-b border-gray-200 px-6 py-4">
                <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
                    <div className="relative flex-1 max-w-md">
                        <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search templates..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>
                </div>
            </div>

            {/* Statistics */}
            <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div className="bg-white p-4 rounded-lg border border-gray-200">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-indigo-100 rounded-lg">
                                <CheckSquare className="text-indigo-600" size={20} />
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Total Templates</p>
                                <p className="text-2xl font-bold text-gray-900">{filteredChecklists.length}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white p-4 rounded-lg border border-gray-200">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-purple-100 rounded-lg">
                                <UserPlus className="text-purple-600" size={20} />
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Ready to Assign</p>
                                <p className="text-2xl font-bold text-gray-900">{filteredChecklists.length}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Checklist Cards */}
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredChecklists.length > 0 ? (
                        filteredChecklists.map((checklist) => (
                            <div key={checklist._id || checklist.id} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
                                {/* Card Header */}
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex-1">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-1">{checklist.name}</h3>
                                        <p className="text-sm text-gray-600 mb-3">{checklist.description}</p>
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(checklist.application_type)}`}>
                                            {checklist.application_type === 'other' ? 'General' : checklist.application_type}
                                        </span>
                                    </div>
                                    <div className="flex items-center space-x-1">
                                        <button
                                            onClick={() => setSelectedChecklist(checklist)}
                                            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded"
                                            title="View Details"
                                        >
                                            <Eye size={16} />
                                        </button>
                                        <button
                                            onClick={() => handleEditClick(checklist)}
                                            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded"
                                            title="Edit Template"
                                        >
                                            <Edit size={16} />
                                        </button>
                                        <button
                                            onClick={() => handleDeleteChecklist(checklist._id || checklist.id)}
                                            className="p-2 text-red-500 hover:text-red-700 hover:bg-red-100 rounded"
                                            title="Delete Template"
                                        >
                                            <Delete size={16} />
                                        </button>
                                    </div>
                                </div>

                                {/* Card Content */}
                                <div className="space-y-3 mb-4">
                                    <div className="flex items-center justify-between text-sm">
                                        <div className="flex items-center gap-2">
                                            <FileText size={14} className="text-gray-500" />
                                            <span className="text-gray-600">Documents</span>
                                        </div>
                                        <span className="font-medium text-gray-900">{checklist.documents.length || 0}</span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                        <div className="flex items-center gap-2">
                                            <CheckSquare size={14} className="text-gray-500" />
                                            <span className="text-gray-600">Tasks</span>
                                        </div>
                                        <span className="font-medium text-gray-900">{checklist.tasks.length || 0}</span>
                                    </div>
                                </div>

                                {/* Card Footer */}
                                <div className="border-t border-gray-200 pt-4">
                                    <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                                        <div className="flex items-center gap-1">
                                            <Calendar size={12} />
                                            <span>Updated {new Date(checklist.updatedAt || checklist.updated_date).toLocaleDateString()}</span>
                                        </div>
                                        <span>By {checklist.created_by || 'Admin'}</span>
                                    </div>

                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() => handleAssignClick(checklist)}
                                            className="flex-1 inline-flex items-center justify-center px-3 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
                                        >
                                            <UserPlus size={14} className="mr-1" />
                                            Assign to Application
                                        </button>
                                        <button
                                            onClick={() => handleEditClick(checklist)}
                                            className="px-3 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm hover:bg-gray-50 transition-colors"
                                            title="Edit Template"
                                        >
                                            <Edit size={14} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full text-center py-12">
                            <CheckSquare size={48} className="text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">No templates found</h3>
                            <p className="text-gray-600 mb-4">
                                {searchTerm || typeFilter !== 'all'
                                    ? 'Try adjusting your search criteria'
                                    : 'Create your first checklist template to get started'
                                }
                            </p>
                            <button
                                onClick={() => setShowCreateModal(true)}
                                className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
                            >
                                <Plus size={16} className="mr-2" />
                                Create Template
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Modal Components */}
            <ChecklistDetailsModal
                isOpen={!!selectedChecklist}
                onClose={() => setSelectedChecklist(null)}
                checklist={selectedChecklist}
                onEdit={handleEditClick}
            />
            <CreateChecklistModal
                isOpen={showCreateModal}
                onClose={() => setShowCreateModal(false)}
                onSubmit={handleCreateSubmit}
            />
            <EditChecklistModal
                isOpen={showEditModal}
                onClose={() => setShowEditModal(false)}
                checklist={editingChecklist}
                onUpdate={handleUpdateChecklist}
                onAddDocument={handleAddDocument}
                onAddTask={handleAddTask}
                onRemoveDocument={handleRemoveDocument}
                onRemoveTask={handleRemoveTask}
            />
            <AssignChecklistModal
                isOpen={showAssignModal}
                onClose={() => setShowAssignModal(false)}
                onSubmit={handleAssignSubmit}
                checklist={checklistToAssign}
                applications={applications}
            />
        </div>
    );
};

const ChecklistLoading = () => (
    <div className="flex flex-col w-full overflow-auto bg-gray-50 min-h-screen">
        <div className="flex items-center justify-center h-64">
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto"></div>
                <p className="mt-4 text-gray-500">Loading checklists...</p>
            </div>
        </div>
    </div>
);

export const Checklist = () => {
    return (
        <Suspense fallback={<ChecklistLoading />}>
            <ChecklistContent />
        </Suspense>
    );
};