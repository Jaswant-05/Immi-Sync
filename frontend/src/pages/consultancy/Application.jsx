import { useState } from 'react';
import { 
  Search, 
  Plus, 
  Eye, 
  Edit, 
  MoreHorizontal,
  Calendar,
  User,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';
import { CreateApplicationModal } from '../../modals/CreateApplicationModal';
import { EditApplicationModal } from '../../modals/EditApplicationModal';
import { ApplicationDetailsModal } from '../../modals/ApplicationDetailsModal';

const mockApplications = [
  {
    id: '1',
    applicant_name: 'Jaswant Singh',
    applicant_email: 'jaswant@email.com',
    application_type: 'citizenship',
    application_status: 'Applied',
    created_date: '2025-01-15',
    updated_date: '2025-01-18',
    documents_count: 8,
    tasks_count: 12,
    tasks_completed: 8
  },
  {
    id: '2',
    applicant_name: 'Michael Johnson',
    applicant_email: 'michael@email.com',
    application_type: 'Work',
    application_status: 'Draft',
    created_date: '2025-01-10',
    updated_date: '2025-01-17',
    documents_count: 5,
    tasks_count: 0,
    tasks_completed: 0
  },
  {
    id: '3',
    applicant_name: 'Muhib Rahman',
    applicant_email: 'muhib@email.com',
    application_type: 'Visitor',
    application_status: 'Approved',
    created_date: '2025-01-05',
    updated_date: '2025-01-15',
    documents_count: 6,
    tasks_count: 6,
    tasks_completed: 6
  },
  {
    id: '4',
    applicant_name: 'Sarah Williams',
    applicant_email: 'sarah@email.com',
    application_type: 'PR',
    application_status: 'Applied',
    created_date: '2025-01-12',
    updated_date: '2025-01-16',
    documents_count: 15,
    tasks_count: 18,
    tasks_completed: 12
  },
  {
    id: '5',
    applicant_name: 'David Chen',
    applicant_email: 'david@email.com',
    application_type: 'Work',
    application_status: 'Declined',
    created_date: '2025-01-08',
    updated_date: '2025-01-14',
    documents_count: 7,
    tasks_count: 10,
    tasks_completed: 10
  }
];

export const Application = () => {
  const [applications] = useState(mockApplications);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingApplication, setEditingApplication] = useState(null);

  function handleClick() {
    setShowCreateModal(true);
  }

  const handleCreateSubmit = () => {
    // Handle form submission here
    console.log('Creating new application...');
  };

  const handleEditSubmit = () => {
    // Handle form submission here
    console.log('Updating application...');
  };

  const handleEditClick = (application) => {
    setEditingApplication(application);
    setShowEditModal(true);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setEditingApplication(null);
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      'Applied': { color: 'bg-blue-100 text-blue-800', icon: Clock },
      'Approved': { color: 'bg-green-100 text-green-800', icon: CheckCircle },
      'Declined': { color: 'bg-red-100 text-red-800', icon: XCircle },
      'Draft': { color: 'bg-gray-100 text-gray-800', icon: AlertCircle }
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

  const getChecklistProgress = (application) => {
    // Check if checklist hasn't been applied yet
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

  const filteredApplications = applications.filter(app => {
    const matchesSearch = app.applicant_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.applicant_email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || app.application_status === statusFilter;
    const matchesType = typeFilter === 'all' || app.application_type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  return (
    <div className="min-w-full flex flex-col px-4 md:px-6 gap-4">
      {/* Header Section */}
      <div className="flex flex-col gap-2 pt-4 md:flex-row md:justify-between md:items-center">
        <div>
          <h1 className="font-bold text-3xl mb-1">Application</h1>
          <p className="text-gray-600">Manage and track all immigration applications</p>
        </div>
      </div>

      {/* Search Section */}
      <div className="w-full">
        <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
          <div className="relative flex-1 max-w-md">
            <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search Applications"
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
              <option value="Applied">Applied</option>
              <option value="Approved">Approved</option>
              <option value="Declined">Declined</option>
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

      {/* Applications Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Applicant
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Checklist
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
              {filteredApplications.map((application) => (
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
                        onClick={() => setSelectedApplication(application)}
                        className="text-indigo-600 hover:text-indigo-900 transition-colors"
                      >
                        <Eye size={16} />
                      </button>
                      <button 
                        onClick={() => handleEditClick(application)}
                        className="text-gray-600 hover:text-gray-900 transition-colors"
                      >
                        <Edit size={16} />
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

      {/* Modal Components */}
      <CreateApplicationModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreateSubmit}
      />

      <EditApplicationModal
        isOpen={showEditModal}
        onClose={handleCloseEditModal}
        onSubmit={handleEditSubmit}
        application={editingApplication}
      />

      <ApplicationDetailsModal
        isOpen={!!selectedApplication}
        onClose={() => setSelectedApplication(null)}
        onEdit={handleEditClick}
        application={selectedApplication}
        getStatusBadge={getStatusBadge}
      />
    </div>
  );
};