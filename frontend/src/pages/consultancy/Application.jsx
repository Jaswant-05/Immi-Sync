import { useState, Suspense } from 'react';
import { useRecoilStateLoadable } from 'recoil';
import axios from 'axios';
import {
    Search,
    CheckCircle,
    XCircle,
    Clock,
    AlertCircle,
} from 'lucide-react';
import { EditApplicationModal } from '../../modals/EditApplicationModal';
import { ApplicationDetailsModal } from '../../modals/ApplicationDetailsModal';
import { ApplicationRow } from '../../ui/ApplicationRow';
import { applicationsAtom } from '../../Recoil/atoms/applicationsAtom';
import { ApplicationSkeleton } from '../../skeletons/ApplicationSkeleton';
import { useAuth } from '../../hooks/useAuth';

const ApplicationContent = () => {
    const [applicationsLoadable, setApplicationsLoadable] = useRecoilStateLoadable(applicationsAtom);
    
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [typeFilter, setTypeFilter] = useState('all');
    const [selectedApplication, setSelectedApplication] = useState(null);
    const [selectedApplicationForEdit, setSelectedApplicationForEdit] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const { token } = useAuth();

    const handleEditSubmit = async (applicationData) => {
        setIsUpdating(true);
        try {
            const response = await axios.put(
                `${import.meta.env.VITE_BACKEND_URL}/applications/${applicationData._id}`,
                {
                    applicant_name: applicationData.applicant_name,
                    applicant_email: applicationData.applicant_email,
                    application_type: applicationData.application_type,
                    application_status: applicationData.application_status,
                    updatedAt: new Date().toISOString()
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (response.data.success) {
                if (applicationsLoadable.state === 'hasValue') {
                    const currentApplications = applicationsLoadable.contents;
                    const updatedApplications = currentApplications.map(app => {
                        if (app._id === applicationData._id) {
                            return {
                                ...app,
                                applicant_name: applicationData.applicant_name,
                                applicant_email: applicationData.applicant_email,
                                application_type: applicationData.application_type,
                                application_status: applicationData.application_status,
                                updatedAt: new Date().toISOString()
                            };
                        }
                        return app;
                    });
                    setApplicationsLoadable(updatedApplications);
                }

                console.log('Application updated successfully');
                
                setShowEditModal(false);
                setSelectedApplicationForEdit(null);
            } else {
                throw new Error(response.data.message || 'Failed to update application');
            }
        } catch (error) {
            console.error('Error updating application:', error);
            alert(error.response?.data?.message || 'Failed to update application. Please try again.');
        } finally {
            setIsUpdating(false);
        }
    };

    const handleEditClick = (application) => {
        setSelectedApplicationForEdit(application);
        setShowEditModal(true);
    };

    const handleCloseEditModal = () => {
        if (!isUpdating) {
            setShowEditModal(false);
            setSelectedApplicationForEdit(null);
        }
    };

    const handleViewClick = (application) => {
        setSelectedApplication(application);
    };

    const getStatusBadge = (status) => {
        const statusConfig = {
            'Applied': { color: 'bg-blue-100 text-blue-800', icon: Clock },
            'Approved': { color: 'bg-green-100 text-green-800', icon: CheckCircle },
            'Declined': { color: 'bg-red-100 text-red-800', icon: XCircle },
            'Draft': { color: 'bg-gray-100 text-gray-800', icon: AlertCircle }
        };

        const config = statusConfig[status] || {
            color: 'bg-gray-100 text-gray-800',
            icon: AlertCircle
        };
        const IconComponent = config.icon;

        return (
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
                <IconComponent size={12} className="mr-1" />
                {status}
            </span>
        );
    };

    if (applicationsLoadable.state === 'loading') {
        return <ApplicationSkeleton />;
    }

    if (applicationsLoadable.state === 'hasError') {
        return (
            <div className="min-w-full flex flex-col px-4 md:px-6 gap-4">
                <div className="flex flex-col gap-2 pt-4 md:flex-row md:justify-between md:items-center">
                    <div>
                        <h1 className="font-bold text-3xl mb-1">Applications</h1>
                        <p className="text-gray-600">Manage and track all immigration applications</p>
                    </div>
                </div>
                <div className="flex items-center justify-center h-64 bg-white rounded-lg shadow-sm border border-gray-200">
                    <div className="text-center">
                        <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                        <p className="text-gray-500 mb-4">Error loading applications</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                        >
                            Retry
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const applications = applicationsLoadable.contents || [];

    const filteredApplications = applications.filter(app => {
        const matchesSearch = (app.applicant_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (app.applicant_email || '').toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || app.application_status === statusFilter;
        const matchesType = typeFilter === 'all' || app.application_type === typeFilter;
        return matchesSearch && matchesStatus && matchesType;
    });

    return (
        <div className="min-w-full flex flex-col px-4 md:px-6 gap-4">
            {/* Header Section */}
            <div className="flex flex-col gap-2 pt-4 md:flex-row md:justify-between md:items-center">
                <div>
                    <h1 className="font-bold text-3xl mb-1">Applications</h1>
                    <p className="text-gray-600">Manage and track all immigration applications</p>
                </div>
                <div className="text-sm text-gray-500">
                    {filteredApplications.length} of {applications.length} applications
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
                            {filteredApplications.length > 0 ? (
                                filteredApplications.map((application) => (
                                    <ApplicationRow
                                        key={application._id}
                                        application={application}
                                        onView={handleViewClick}
                                        onEdit={handleEditClick}
                                        getStatusBadge={getStatusBadge}
                                    />
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="px-6 py-12 text-center text-sm text-gray-500">
                                        <div className="flex flex-col items-center">
                                            <AlertCircle className="h-8 w-8 text-gray-400 mb-2" />
                                            <p className="mb-2">No applications found</p>
                                            <p className="text-xs text-gray-400">
                                                {searchTerm || statusFilter !== 'all' || typeFilter !== 'all'
                                                    ? 'Try adjusting your search criteria'
                                                    : 'Applications will appear here when clients create them'
                                                }
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal Components */}
            <EditApplicationModal
                isOpen={showEditModal}
                onClose={handleCloseEditModal}
                onSubmit={handleEditSubmit}
                application={selectedApplicationForEdit}
                isLoading={isUpdating}
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

const ApplicationLoading = () => (
    <div className="min-w-full flex flex-col px-4 md:px-6 gap-4">
        <div className="flex items-center justify-center h-64">
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto"></div>
                <p className="mt-4 text-gray-500">Loading applications...</p>
            </div>
        </div>
    </div>
);

export const Application = () => {
    return (
        <Suspense fallback={<ApplicationLoading />}>
            <ApplicationContent />
        </Suspense>
    );
};