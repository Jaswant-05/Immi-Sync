import { useState } from "react";
import { XCircle, UserPlus, Search, FileText, CheckSquare } from "lucide-react";

export const AssignChecklistModal = ({ isOpen, onClose, onSubmit, checklist, applications = [] }) => {
  const [selectedApplication, setSelectedApplication] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  if (!isOpen || !checklist) return null;

  const filteredApplications = applications.filter(app =>
    app.applicant_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.applicant_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.application_type?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = () => {
    if (selectedApplication) {
      const applicationToAssign = filteredApplications.find(app => app._id === selectedApplication || app.id === selectedApplication);
      onSubmit({
        checklistId: checklist._id || checklist.id,
        applicationId: selectedApplication,
        applicationName: applicationToAssign?.applicant_name,
        applicationType: applicationToAssign?.application_type
      });
      setSelectedApplication('');
      setSearchTerm('');
      onClose();
    }
  };

  const handleCancel = () => {
    setSelectedApplication('');
    setSearchTerm('');
    onClose();
  };

  const getStatusBadge = (status) => {
    const colors = {
      'Draft': 'bg-gray-100 text-gray-800',
      'Applied': 'bg-blue-100 text-blue-800',
      'Approved': 'bg-green-100 text-green-800',
      'Declined': 'bg-red-100 text-red-800'
    };
    return `inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${colors[status] || 'bg-gray-100 text-gray-800'}`;
  };

  const getTypeColor = (type) => {
    const colors = {
      'citizenship': 'bg-purple-100 text-purple-800',
      'Work': 'bg-blue-100 text-blue-800', 
      'Visitor': 'bg-green-100 text-green-800',
      'PR': 'bg-indigo-100 text-indigo-800'
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="fixed inset-0 backdrop-blur-sm backdrop-brightness-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Assign Checklist Template</h2>
              <p className="text-sm text-gray-600 mt-1">Assign "{checklist.name}" to an application</p>
            </div>
            <button
              onClick={handleCancel}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <XCircle size={24} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Checklist Summary */}
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <h3 className="font-semibold text-gray-900 mb-2">{checklist.name}</h3>
            <p className="text-sm text-gray-600 mb-3">{checklist.description}</p>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1">
                <FileText size={14} className="text-gray-500" />
                <span className="text-gray-600">{checklist.documents_count} documents</span>
              </div>
              <div className="flex items-center gap-1">
                <CheckSquare size={14} className="text-gray-500" />
                <span className="text-gray-600">{checklist.tasks_count} tasks</span>
              </div>
            </div>
          </div>

          {/* Search Applications */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search Applications
            </label>
            <div className="relative">
              <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, email, or type..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Applications List */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Select Application to Assign
            </label>
            <div className="max-h-64 overflow-y-auto border border-gray-200 rounded-lg">
              {filteredApplications.length > 0 ? (
                <div className="divide-y divide-gray-200">
                  {filteredApplications.map((application) => (
                    <label
                      key={application.id}
                      className="flex items-center p-4 hover:bg-gray-50 cursor-pointer"
                    >
                      <input
                        type="radio"
                        name="application"
                        value={application._id || application.id}
                        checked={selectedApplication === (application._id || application.id)}
                        onChange={(e) => setSelectedApplication(e.target.value)}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                      />
                      <div className="ml-3 flex-1">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-900">{application.applicant_name}</p>
                            <p className="text-sm text-gray-500">{application.applicant_email}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getTypeColor(application.application_type)}`}>
                              {application.application_type}
                            </span>
                            <span className={getStatusBadge(application.application_status)}>
                              {application.application_status}
                            </span>
                          </div>
                        </div>
                        <p className="text-xs text-gray-400 mt-1">
                          Created {new Date(application.createdAt || application.created_date).toLocaleDateString()}
                        </p>
                      </div>
                    </label>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center text-gray-500">
                  <p>No applications found</p>
                  <p className="text-sm">Try adjusting your search criteria</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
          <button
            onClick={handleCancel}
            className="px-6 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!selectedApplication}
            className={`px-6 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
              selectedApplication
                ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            <UserPlus size={16} />
            Assign Checklist
          </button>
        </div>
      </div>
    </div>
  );
};