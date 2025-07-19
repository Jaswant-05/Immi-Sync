export const ApplicationSkeleton = () => {
    return (
        <div className="min-w-full flex flex-col px-4 md:px-6 gap-4">
            <div className="flex flex-col gap-2 pt-4 md:flex-row md:justify-between md:items-center">
                <div>
                    <h1 className="font-bold text-3xl mb-1">Application</h1>
                    <p className="text-gray-600">Manage and track all immigration applications</p>
                </div>
                <div className="animate-pulse bg-gray-200 h-10 w-36 rounded-lg"></div>
            </div>

            <div className="w-full">
                <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
                    <div className="relative flex-1 max-w-md">
                        <div className="animate-pulse bg-gray-200 h-10 w-full rounded-lg"></div>
                    </div>
                    <div className="flex space-x-3">
                        <div className="animate-pulse bg-gray-200 h-10 w-24 rounded-lg"></div>
                        <div className="animate-pulse bg-gray-200 h-10 w-24 rounded-lg"></div>
                    </div>
                </div>
            </div>

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
                            {[...Array(5)].map((_, index) => (
                                <tr key={index}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="animate-pulse bg-gray-200 h-10 w-10 rounded-full"></div>
                                            <div className="ml-4">
                                                <div className="animate-pulse bg-gray-200 h-4 w-32 rounded mb-1"></div>
                                                <div className="animate-pulse bg-gray-200 h-3 w-40 rounded"></div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="animate-pulse bg-gray-200 h-6 w-16 rounded-full"></div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="animate-pulse bg-gray-200 h-6 w-20 rounded-full"></div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center space-x-2">
                                            <div className="animate-pulse bg-gray-200 h-4 w-12 rounded"></div>
                                            <div className="animate-pulse bg-gray-200 h-2 w-16 rounded-full"></div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="animate-pulse bg-gray-200 h-4 w-20 rounded"></div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center space-x-2">
                                            <div className="animate-pulse bg-gray-200 h-4 w-4 rounded"></div>
                                            <div className="animate-pulse bg-gray-200 h-4 w-4 rounded"></div>
                                            <div className="animate-pulse bg-gray-200 h-4 w-4 rounded"></div>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};