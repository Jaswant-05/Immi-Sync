import { useState } from 'react';
import { 
  Search, 
  Plus, 
  Eye, 
  Edit, 
  Download, 
  MoreHorizontal,
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  CheckSquare,
  Copy,
} from 'lucide-react';
import { ChecklistDetailsModal } from '../../modals/ChecklistDetailsModal';
import { CreateChecklistModal } from '../../modals/CreateChecklistModal';

const mockChecklists = [
  {
    id: '1',
    consultancy_id: 'cons1',
    user_id: 'user1',
    application_id: 'app1',
    user_name: 'Jaswant Singh',
    application_name: 'Citizenship Application',
    application_type: 'citizenship',
    documents_count: 8,
    tasks_count: 12,
    tasks_completed: 8,
    documents_completed: 6,
    created_date: '2025-01-15',
    updated_date: '2025-01-18',
    status: 'Active'
  },
  {
    id: '2',
    consultancy_id: 'cons1',
    user_id: 'user2',
    application_id: 'app2',
    user_name: 'Michael Johnson',
    application_name: 'Work Permit Application',
    application_type: 'Work',
    documents_count: 5,
    tasks_count: 8,
    tasks_completed: 3,
    documents_completed: 2,
    created_date: '2025-01-10',
    updated_date: '2025-01-17',
    status: 'Draft'
  },
  {
    id: '3',
    consultancy_id: 'cons1',
    user_id: 'user3',
    application_id: 'app3',
    user_name: 'Muhib Rahman',
    application_name: 'Visitor Visa Application',
    application_type: 'Visitor',
    documents_count: 6,
    tasks_count: 6,
    tasks_completed: 6,
    documents_completed: 6,
    created_date: '2025-01-05',
    updated_date: '2025-01-15',
    status: 'Completed'
  },
  {
    id: '4',
    consultancy_id: 'cons1',
    documents_count: 10,
    tasks_count: 15,
    tasks_completed: 0,
    documents_completed: 0,
    created_date: '2025-01-12',
    updated_date: '2025-01-16',
    status: 'Draft'
  }
];

export const Checklist = () => {
  const [checklists] = useState(mockChecklists);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [selectedChecklist, setSelectedChecklist] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const handleCreateSubmit = () => {
    console.log('Creating new checklist...');
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      'Active': { color: 'bg-blue-100 text-blue-800', icon: Clock },
      'Completed': { color: 'bg-green-100 text-green-800', icon: CheckCircle },
      'Draft': { color: 'bg-gray-100 text-gray-800', icon: AlertCircle },
      'Archived': { color: 'bg-red-100 text-red-800', icon: XCircle }
    };
    
    const config = statusConfig[status];
    const IconComponent = config.icon;
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        <IconComponent size={12} className="mr-1" />
        {status}
      </span>
    );
  };

  const getProgressBar = (completed, total) => {
    const percentage = total > 0 ? (completed / total) * 100 : 0;
    return (
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div 
          className="bg-blue-500 h-2 rounded-full transition-all duration-300"
          style={{ width: `${percentage}%` }}
        />
      </div>
    );
  };

  const filteredChecklists = checklists.filter(checklist => {
    const matchesSearch = (checklist.user_name?.toLowerCase().includes(searchTerm.toLowerCase()) || '') ||
                         (checklist.application_name?.toLowerCase().includes(searchTerm.toLowerCase()) || '');
    const matchesStatus = statusFilter === 'all' || checklist.status === statusFilter;
    const matchesType = typeFilter === 'all' || checklist.application_type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  return (
    <div className="flex flex-col w-full overflow-auto bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Checklists</h1>
            <p className="text-gray-600 mt-1">Manage document and task checklists for applications</p>
          </div>
          <div className="mt-4 sm:mt-0 flex space-x-3">
            <button 
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
            >
              <Plus size={16} className="mr-2" />
              New Checklist
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
              placeholder="Search checklists..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          
          <div className="flex space-x-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="all">All Status</option>
              <option value="Draft">Draft</option>
              <option value="Active">Active</option>
              <option value="Completed">Completed</option>
              <option value="Archived">Archived</option>
            </select>
            
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="all">All Types</option>
              <option value="Visitor">Visitor</option>
              <option value="Work">Work</option>
              <option value="PR">PR</option>
              <option value="citizenship">Citizenship</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>
      </div>

      {/* Checklists Table */}
      <div className="flex-1 p-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Checklist Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Application
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Progress
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Updated
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredChecklists.map((checklist) => (
                  <tr key={checklist.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                            <CheckSquare size={16} className="text-indigo-600" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {checklist.user_name ? `${checklist.user_name}'s Checklist` : 'General Checklist'}
                          </div>
                          <div className="text-sm text-gray-500">
                            Created {new Date(checklist.created_date).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {checklist.application_name ? (
                        <div>
                          <div className="text-sm font-medium text-gray-900">{checklist.application_name}</div>
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-indigo-100 text-indigo-800">
                            {checklist.application_type}
                          </span>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-500">No application linked</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(checklist.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span>Tasks</span>
                          <span>{checklist.tasks_completed}/{checklist.tasks_count}</span>
                        </div>
                        {getProgressBar(checklist.tasks_completed, checklist.tasks_count)}
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span>Documents</span>
                          <span>{checklist.documents_completed}/{checklist.documents_count}</span>
                        </div>
                        {getProgressBar(checklist.documents_completed, checklist.documents_count)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center">
                        <Calendar size={14} className="mr-1" />
                        {new Date(checklist.updated_date).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => setSelectedChecklist(checklist)}
                          className="text-indigo-600 hover:text-indigo-900 transition-colors"
                        >
                          <Eye size={16} />
                        </button>
                        <button className="text-gray-600 hover:text-gray-900 transition-colors">
                          <Edit size={16} />
                        </button>
                        <button className="text-gray-600 hover:text-gray-900 transition-colors">
                          <Copy size={16} />
                        </button>
                        <button className="text-gray-600 hover:text-gray-900 transition-colors">
                          <MoreHorizontal size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal Components */}
      <ChecklistDetailsModal
        isOpen={!!selectedChecklist}
        onClose={() => setSelectedChecklist(null)}
        checklist={selectedChecklist}
      />

      <CreateChecklistModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreateSubmit}
      />
    </div>
  );
};