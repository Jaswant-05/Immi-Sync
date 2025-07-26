import { useEffect, useState } from "react";
import {
    XCircle,
    CheckSquare,
    FileText,
    Plus,
    Trash2,
    Edit,
    Save
} from "lucide-react";

export const EditChecklistModal = ({ 
    isOpen, 
    onClose, 
    checklist, 
    onUpdate, 
    onAddDocument, 
    onAddTask, 
    onRemoveDocument, 
    onRemoveTask 
}) => {
    const [activeTab, setActiveTab] = useState('details');
    const [checklistData, setChecklistData] = useState({
        name: checklist?.name || '',
        description: checklist?.description || ''
    });
    const [newDocument, setNewDocument] = useState({ name: '' });
    const [newTask, setNewTask] = useState({ title: '', description: '' });
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (checklist) {
            setChecklistData({
                name: checklist.name || '',
                description: checklist.description || ''
            });
        }
    }, [checklist]);


    if (!isOpen || !checklist) return null;

    const checklistId = checklist._id 
    

    const documents = (checklist.documents || []).filter(doc => doc && doc._id );
    const tasks = (checklist.tasks || []).filter(task => task && task.title && task._id);

    const handleUpdateChecklist = async () => {
        setIsLoading(true);
        try {
            await onUpdate(checklistId, checklistData);
        } catch (error) {
            console.error('Error updating checklist:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddDocument = async () => {
        if (newDocument.name.trim()) {
            setIsLoading(true);
            try {
                await onAddDocument(checklistId, newDocument);
                setNewDocument({ name: '' });
            } catch (error) {
                console.error('Error adding document:', error);
            } finally {
                setIsLoading(false);
            }
        }
    };

    const handleAddTask = async () => {
        if (newTask.title.trim() && newTask.description.trim()) {
            setIsLoading(true);
            try {
                await onAddTask(checklistId, newTask);
                setNewTask({ title: '', description: '' });
            } catch (error) {
                console.error('Error adding task:', error);
            } finally {
                setIsLoading(false);
            }
        }
    };

    const handleRemoveDocument = async (documentId) => {
        setIsLoading(true);
        try {
            await onRemoveDocument(checklistId, documentId);
        } catch (error) {
            console.error('Error removing document:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleRemoveTask = async (taskId) => {
        setIsLoading(true);
        try {
            await onRemoveTask(checklistId, taskId);
        } catch (error) {
            console.error('Error removing task:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const tabs = [
        { id: 'details', label: 'Details', icon: Edit },
        { id: 'documents', label: `Documents (${documents.length})`, icon: FileText },
        { id: 'tasks', label: `Tasks (${tasks.length})`, icon: CheckSquare }
    ];

    return (
        <div className="fixed inset-0 backdrop-blur-sm backdrop-brightness-75 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
                {/* Header */}
                <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-indigo-100 rounded-lg">
                                <CheckSquare size={20} className="text-indigo-600" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-gray-900">Edit Checklist Template</h2>
                                <p className="text-sm text-gray-600">{checklist.name}</p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600 transition-colors"
                            disabled={isLoading}
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
                    {activeTab === 'details' && (
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Checklist Name *
                                </label>
                                <input
                                    type="text"
                                    value={checklistData.name}
                                    onChange={(e) => setChecklistData(prev => ({ ...prev, name: e.target.value }))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                    disabled={isLoading}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Description *
                                </label>
                                <textarea
                                    rows={4}
                                    value={checklistData.description}
                                    onChange={(e) => setChecklistData(prev => ({ ...prev, description: e.target.value }))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                    disabled={isLoading}
                                />
                            </div>
                            <button
                                onClick={handleUpdateChecklist}
                                disabled={isLoading}
                                className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                    isLoading
                                        ? 'bg-indigo-400 cursor-not-allowed'
                                        : 'bg-indigo-600 hover:bg-indigo-700'
                                } text-white`}
                            >
                                {isLoading ? (
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                ) : (
                                    <Save size={16} />
                                )}
                                {isLoading ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    )}

                    {activeTab === 'documents' && (
                        <div className="space-y-6">
                            {/* Add Document */}
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <h4 className="font-medium text-gray-900 mb-3">Add New Document</h4>
                                <div className="flex gap-3">
                                    <input
                                        type="text"
                                        placeholder="Document name (e.g., Passport Copy)"
                                        value={newDocument.name}
                                        onChange={(e) => setNewDocument({ name: e.target.value })}
                                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                        disabled={isLoading}
                                    />
                                    <button
                                        onClick={handleAddDocument}
                                        disabled={isLoading || !newDocument.name.trim()}
                                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                                            isLoading || !newDocument.name.trim()
                                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                                : 'bg-indigo-600 text-white hover:bg-indigo-700'
                                        }`}
                                    >
                                        <Plus size={16} />
                                        Add Document
                                    </button>
                                </div>
                            </div>

                            {/* Documents List */}
                            <div>
                                <h4 className="font-medium text-gray-900 mb-3">Required Documents</h4>
                                {documents.length > 0 ? (
                                    <div className="space-y-2">
                                        {documents.map((doc) => (
                                            <div key={doc._id || doc.id} className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg">
                                                <div className="flex items-center gap-3">
                                                    <FileText size={16} className="text-gray-500" />
                                                    <span className="font-medium text-gray-900">{doc.name || 'Unnamed Document'}</span>
                                                </div>
                                                <button
                                                    onClick={() => handleRemoveDocument(doc._id || doc.id)}
                                                    disabled={isLoading}
                                                    className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                                                    title="Remove Document"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-8 text-gray-500">
                                        <FileText size={48} className="mx-auto mb-2 text-gray-400" />
                                        <p>No documents added yet</p>
                                        <p className="text-sm">Add document requirements above</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {activeTab === 'tasks' && (
                        <div className="space-y-6">
                            {/* Add Task */}
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <h4 className="font-medium text-gray-900 mb-3">Add New Task</h4>
                                <div className="space-y-3">
                                    <input
                                        type="text"
                                        placeholder="Task title (e.g., Fill Application Form)"
                                        value={newTask.title}
                                        onChange={(e) => setNewTask(prev => ({ ...prev, title: e.target.value }))}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                        disabled={isLoading}
                                    />
                                    <textarea
                                        rows={2}
                                        placeholder="Task description..."
                                        value={newTask.description}
                                        onChange={(e) => setNewTask(prev => ({ ...prev, description: e.target.value }))}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                        disabled={isLoading}
                                    />
                                    <button
                                        onClick={handleAddTask}
                                        disabled={isLoading || !newTask.title.trim() || !newTask.description.trim()}
                                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                                            isLoading || !newTask.title.trim() || !newTask.description.trim()
                                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                                : 'bg-indigo-600 text-white hover:bg-indigo-700'
                                        }`}
                                    >
                                        <Plus size={16} />
                                        Add Task
                                    </button>
                                </div>
                            </div>

                            {/* Tasks List */}
                            <div>
                                <h4 className="font-medium text-gray-900 mb-3">Required Tasks</h4>
                                {tasks.length > 0 ? (
                                    <div className="space-y-2">
                                        {tasks.map((task) => (
                                            <div key={task._id || task.id} className="p-3 bg-white border border-gray-200 rounded-lg">
                                                <div className="flex items-start justify-between">
                                                    <div className="flex items-start gap-3 flex-1">
                                                        <CheckSquare size={16} className="text-gray-500 mt-1" />
                                                        <div>
                                                            <h5 className="font-medium text-gray-900">{task.title || 'Untitled Task'}</h5>
                                                            <p className="text-sm text-gray-600 mt-1">{task.description || 'No description'}</p>
                                                        </div>
                                                    </div>
                                                    <button
                                                        onClick={() => handleRemoveTask(task._id || task.id)}
                                                        disabled={isLoading}
                                                        className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                                                        title="Remove Task"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-8 text-gray-500">
                                        <CheckSquare size={48} className="mx-auto mb-2 text-gray-400" />
                                        <p>No tasks added yet</p>
                                        <p className="text-sm">Add task requirements above</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-gray-200 flex justify-end">
                    <button
                        onClick={onClose}
                        disabled={isLoading}
                        className={`px-6 py-2 border border-gray-300 rounded-lg text-sm font-medium transition-colors ${
                            isLoading
                                ? 'text-gray-400 cursor-not-allowed'
                                : 'text-gray-700 hover:bg-gray-50'
                        }`}
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};