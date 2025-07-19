import { AlertCircle, CheckCircle, Clock, FileCheck2, UserCheck, Users, XCircle } from "lucide-react";
import { useRecoilValueLoadable } from "recoil";
import { StatCard } from "../../ui/StatCard";
import { Suspense } from "react";
import { allApplicationCountsSelector, recentApplicationsSelector, totalUserSelector } from "../../Recoil/selectors/consultancySelector";

const DashboardSkeleton = () => (
    <div className="flex flex-col w-full overflow-auto">
        <div className="text-2xl font-bold w-full px-6 py-4 bg-white">
            <p>Welcome NNC</p>
        </div>
        <div className="">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 my-8 px-6 h-full">
                {[...Array(4)].map((_, index) => (
                    <div key={index} className="bg-white p-6 rounded-lg shadow ">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="animate-pulse bg-gray-200 h-4 w-20 rounded mb-2"></div>
                                <div className="animate-pulse bg-gray-200 h-8 w-12 rounded"></div>
                            </div>
                            <div className="animate-pulse bg-gray-200 h-10 w-10 rounded"></div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mx-6 font-medium shadow rounded-lg overflow-x-auto">
                <div className="text-xl py-4 px-4 border border-gray-200 bg-white">
                    <p>Recent Applications</p>
                </div>
                <div className="w-full overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <td className="px-6 py-3 font-medium text-xs text-gray-500 uppercase tracking-wider">NAME</td>
                                <td className="px-6 py-3 font-medium text-xs text-gray-500 uppercase tracking-wider">TYPE</td>
                                <td className="px-6 py-3 font-medium text-xs text-gray-500 uppercase tracking-wider">STATUS</td>
                                <td className="px-6 py-3 font-medium text-xs text-gray-500 uppercase tracking-wider">DATE</td>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {[...Array(5)].map((_, index) => (
                                <tr key={index}>
                                    <td className="px-6 py-3 whitespace-nowrap">
                                        <div className="animate-pulse bg-gray-200 h-4 w-24 rounded"></div>
                                    </td>
                                    <td className="px-6 py-3 whitespace-nowrap">
                                        <div className="animate-pulse bg-gray-200 h-4 w-20 rounded"></div>
                                    </td>
                                    <td className="px-6 py-3 whitespace-nowrap">
                                        <div className="animate-pulse bg-gray-200 h-6 w-16 rounded-full"></div>
                                    </td>
                                    <td className="px-6 py-3 whitespace-nowrap">
                                        <div className="animate-pulse bg-gray-200 h-4 w-20 rounded"></div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
);

const DashboardContent = () => {
    const totalUsersLoadable = useRecoilValueLoadable(totalUserSelector);
    const applicationCountsLoadable = useRecoilValueLoadable(allApplicationCountsSelector);
    const recentApplicationsLoadable = useRecoilValueLoadable(recentApplicationsSelector);

    const getStatusBadge = (status) => {
        const statusConfig = {
            'Applied': { color: 'bg-blue-100 text-blue-800', icon: Clock },
            'Approved': { color: 'bg-green-100 text-green-800', icon: CheckCircle },
            'Declined': { color: 'bg-red-100 text-red-800', icon: XCircle },
            'Draft': { color: 'bg-gray-100 text-gray-800', icon: AlertCircle }
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

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };


    const isLoading = totalUsersLoadable.state === 'loading' || 
                     applicationCountsLoadable.state === 'loading' || 
                     recentApplicationsLoadable.state === 'loading';

    const hasError = totalUsersLoadable.state === 'hasError' || 
                    applicationCountsLoadable.state === 'hasError' || 
                    recentApplicationsLoadable.state === 'hasError';

    if (isLoading) {
        return <DashboardSkeleton />;
    }

    if (hasError) {
        return (
            <div className="flex flex-col w-full overflow-auto">
                <div className="text-2xl font-bold w-full px-6 py-4 border-b border-gray-200 bg-white">
                    <p>Welcome NNC</p>
                </div>
                <div className="flex items-center justify-center h-64">
                    <div className="text-center">
                        <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                        <p className="text-gray-500">Error loading dashboard data</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                        >
                            Retry
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const totalUsers = totalUsersLoadable.state === 'hasValue' ? totalUsersLoadable.contents : 0;
    const applicationCounts = applicationCountsLoadable.state === 'hasValue' 
        ? applicationCountsLoadable.contents 
        : { totalApplied: 0, totalDraft: 0, totalApproved: 0 };
    const recentApplications = recentApplicationsLoadable.state === 'hasValue' 
        ? recentApplicationsLoadable.contents 
        : [];

    const totalApplications = applicationCounts.totalApplied + applicationCounts.totalDraft + applicationCounts.totalApproved;

    return (
        <div className="flex flex-col w-full overflow-auto">
            <div className="text-2xl font-bold w-full px-6 py-4 border-b border-gray-200 bg-white">
                <p>Welcome NNC</p>
            </div>
            <div className="">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 my-8 px-6 h-full">
                    <StatCard
                        icon={<Users className="text-blue-500" />}
                        title="Active Users"
                        value={totalUsers}
                    />
                    <StatCard
                        icon={<UserCheck className="text-green-500" />}
                        title="Total Applications"
                        value={totalApplications}
                    />
                    <StatCard
                        icon={<FileCheck2 className="text-yellow-500" />}
                        title="Draft Applications"
                        value={applicationCounts.totalDraft}
                    />
                    <StatCard
                        icon={<FileCheck2 className="text-indigo-500" />}
                        title="Approved Applications"
                        value={applicationCounts.totalApproved}
                    />
                </div>

                <div className="mx-6 font-medium shadow rounded-lg overflow-x-auto">
                    <div className="text-xl py-4 px-4 border border-gray-200 bg-white">
                        <p>Recent Applications</p>
                    </div>
                    <div className="w-full overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <td className="px-6 py-3 font-medium text-xs text-gray-500 uppercase tracking-wider">NAME</td>
                                    <td className="px-6 py-3 font-medium text-xs text-gray-500 uppercase tracking-wider">TYPE</td>
                                    <td className="px-6 py-3 font-medium text-xs text-gray-500 uppercase tracking-wider">STATUS</td>
                                    <td className="px-6 py-3 font-medium text-xs text-gray-500 uppercase tracking-wider">DATE</td>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {recentApplications.length > 0 ? (
                                    recentApplications.slice(0, 5).map((app, index) => (
                                        <tr key={app.id || app._id || index} className="hover:bg-gray-50">
                                            <td className="px-6 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                                                {app.applicant_name || app.name || 'Unknown'}
                                            </td>
                                            <td className="px-6 py-3 whitespace-nowrap text-sm font-medium text-gray-500">
                                                {app.application_type || app.type || 'General'}
                                            </td>
                                            <td className="px-6 py-3 whitespace-nowrap">
                                                {getStatusBadge(app.application_status || app.status || 'Draft')}
                                            </td>
                                            <td className="px-6 py-3 whitespace-nowrap text-sm font-medium text-gray-500">
                                                {formatDate(app.created_at || app.date || app.createdAt)}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4" className="px-6 py-8 text-center text-sm text-gray-500">
                                            No recent applications found
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export const Dashboard = () => {
    return (
        <Suspense fallback={<DashboardSkeleton />}>
            <DashboardContent />
        </Suspense>
    );
};