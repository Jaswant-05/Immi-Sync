import { FileCheck2, UserCheck, Users } from "lucide-react";
import { StatCard } from "../../ui/StatCard";

export const Dashboard = () => {
    return (
        <div className="flex flex-col w-full overflow-auto ">
            <div className="text-2xl font-bold w-full px-6 py-4 border-b border-gray-200 bg-white">
                <p>Welcome NNC</p>
            </div>
            <div className="">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 my-8 px-6 h-full">
                    <StatCard
                        icon={<Users className="text-blue-500" />}
                        title="Active Users"
                        value={45}
                        trend="+12%"
                    />
                    <StatCard
                        icon={<UserCheck className="text-green-500" />}
                        title="Active Application"
                        value={90}
                        trend="+5%"
                    />
                    <StatCard
                        icon={<FileCheck2 className="text-yellow-500" />}
                        title="Pending Applications"
                        value={20}
                        trend="-3%"
                    />
                    <StatCard
                        icon={<FileCheck2 className="text-indigo-500" />}
                        title="Approved Applications"
                        value={70}
                        trend="+8%"
                    />
                </div>

                <div className="mx-6 font-medium shadow rounded-lg overflow-x-auto">
                    <div className="text-xl py-4 px-4 border border-gray-200 bg-white">
                        <p>Recent Applications</p>
                    </div>
                    <div className="w-full overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <td className="px-6 py-3 font-medium text-xs text-gray-500">NAME</td>
                                <td className="px-6 py-3 font-medium text-xs text-gray-500">TYPE</td>
                                <td className="px-6 py-3 font-medium text-xs text-gray-500">STATUS</td>
                                <td className="px-6 py-3 font-medium text-xs text-gray-500">DATE</td>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                <tr>
                                    <td className="px-6 py-3 whitespace-nowrap text-sm font-medium text-gray-900">Jaswant</td>
                                    <td className="px-6 py-3 whitespace-nowrap text-sm font-medium text-gray-500">Citizenship</td>
                                    <td className="px-6 py-3 whitespace-nowrap text-sm font-medium text-gray-500">Submitted</td>
                                    <td className="px-6 py-3 whitespace-nowrap text-sm font-medium text-gray-500">12-05-2025</td>
                                </tr>
                                <tr>
                                    <td className="px-6 py-3 whitespace-nowrap text-sm font-medium text-gray-900">Micheal</td>
                                    <td className="px-6 py-3 whitespace-nowrap text-sm font-medium text-gray-500">Student</td>
                                    <td className="px-6 py-3 whitespace-nowrap text-sm font-medium text-gray-500">in progress</td>
                                    <td className="px-6 py-3 whitespace-nowrap text-sm font-medium text-gray-500">02-04-2025</td>
                                </tr>
                                <tr>
                                    <td className="px-6 py-3 whitespace-nowrap text-sm font-medium text-gray-900">Muhib</td>
                                    <td className="px-6 py-3 whitespace-nowrap text-sm font-medium text-gray-500">Visitor</td>
                                    <td className="px-6 py-3 whitespace-nowrap text-sm font-medium text-gray-500">Approved</td>
                                    <td className="px-6 py-3 whitespace-nowrap text-sm font-medium text-gray-500">10-02-2025</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
};