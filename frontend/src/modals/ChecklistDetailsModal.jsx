import { XCircle } from "lucide-react";

export const ChecklistDetailsModal = ({ isOpen, onClose, checklist }) => {
  if (!isOpen || !checklist) return null;

  return (
     <div className="fixed inset-0 backdrop-blur-sm backdrop-brightness-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                {checklist.user_name ? `${checklist.user_name}'s Checklist` : 'General Checklist'}
              </h2>
              <p className="text-gray-600 mt-1">
                {checklist.application_name || 'No application linked'}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <XCircle size={24} />
            </button>
          </div>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Checklist Information</h3>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-500">Status</label>
                  <p className="text-sm text-gray-900">{checklist.status}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Application Type</label>
                  <p className="text-sm text-gray-900">{checklist.application_type || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Assigned User</label>
                  <p className="text-sm text-gray-900">{checklist.user_name || 'Unassigned'}</p>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Progress Summary</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">Tasks</span>
                    <span className="text-sm text-gray-500">
                      {checklist.tasks_completed}/{checklist.tasks_count}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${checklist.tasks_count > 0 ? (checklist.tasks_completed / checklist.tasks_count) * 100 : 0}%` }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">Documents</span>
                    <span className="text-sm text-gray-500">
                      {checklist.documents_completed}/{checklist.documents_count}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${checklist.documents_count > 0 ? (checklist.documents_completed / checklist.documents_count) * 100 : 0}%` }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700">Created</span>
                    <span className="text-sm text-gray-500">{new Date(checklist.created_date).toLocaleDateString()}</span>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700">Last Updated</span>
                    <span className="text-sm text-gray-500">{new Date(checklist.updated_date).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-6 flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Close
            </button>
            <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors">
              Edit Checklist
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};