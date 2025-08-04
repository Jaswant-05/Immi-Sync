import { useRecoilState } from "recoil";
import { currentApplicationAtom } from "../Recoil/atoms/currentApplicationAtom";
import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";

export const ActiveApplicationSelector = () => {
    const [activeApplication, setActiveApplication] = useRecoilState(currentApplicationAtom);
    const [applications, setApplications] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const { token } = useAuth();

    useEffect(() => {
        if (!token) return;
        
        const fetchData = async () => {
            try {
                const userRes = await fetch(`${import.meta.env.VITE_BACKEND_URL}/user/info`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                const userData = await userRes.json();
                
                const appsRes = await fetch(`${import.meta.env.VITE_BACKEND_URL}/applications`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                const appsData = await appsRes.json();
                
                if (appsData.success) {
                    setApplications(appsData.applications || []);
                }
                
                setActiveApplication(userData.user.active_application);
                setIsLoading(false);
            } catch (err) {
                console.error(err);
                setIsLoading(false);
            }
        };
        
        fetchData();
    }, [token, setActiveApplication]);

    const handleApplicationChange = async (e) => {
        const selectedAppId = e.target.value;
        const selectedApp = applications.find(app => app._id === selectedAppId);
        
        if (!selectedApp) return;
        
        try {
            setActiveApplication(selectedApp);
            
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/user/update`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ active_application: selectedApp })
            });
            
            if (!response.ok) {
                throw new Error('Failed to update');
            }
        } catch (error) {
            console.error('Failed to update active application:', error);
        }
    };

    if (isLoading) {
        return (
            <div className="w-full bg-white border-b border-gray-200 px-6 py-3 flex justify-end">
                <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-500"></div>
                    <span className="text-sm text-gray-500">Loading...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full bg-white border-b border-gray-200 px-6 py-3 flex justify-between">
            <div className="flex items-center text-xl">
                {activeApplication?.applicant_name || 'No Application Selected'}
            </div>
            <div className="flex items-center space-x-3">
                <label htmlFor="application-select" className="text-sm font-medium text-gray-700">
                    Active Application:
                </label>
                <select
                    id="application-select"
                    value={activeApplication?._id || ""}
                    onChange={handleApplicationChange}
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-900 bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                >
                    <option value="" disabled>Select an application...</option>
                    {applications.map((app) => (
                        <option key={app._id} value={app._id}>
                            {app.applicant_name} - {app.application_type?.toUpperCase()}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
};