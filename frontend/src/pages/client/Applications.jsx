import { useState, useEffect } from 'react';
import { User, Mail, Building, FileText, Save, AlertCircle, CheckCircle, Loader } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

export const ClientApplication = () => {
    const { token } = useAuth();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoadingConsultancies, setIsLoadingConsultancies] = useState(true);
    const [submitStatus, setSubmitStatus] = useState(null);
    const [consultancies, setConsultancies] = useState([]);
    const [formData, setFormData] = useState({
        applicant_name: '',
        applicant_email: '',
        application_type: '',
        consultancy: ''
    });
    const [errors, setErrors] = useState({});

    const applicationTypes = [
        { value: 'PR', label: 'Permanent Residence', icon: '🏠' },
        { value: 'Work', label: 'Work Permit', icon: '💼' },
        { value: 'Visitor', label: 'Visitor Visa', icon: '✈️' },
        { value: 'citizenship', label: 'Citizenship', icon: '🇨🇦' },
        { value: 'other', label: 'Other', icon: '📋' }
    ];

    useEffect(() => {
        const fetchConsultancies = async () => {
            if (!token) return;
            
            try {
                setIsLoadingConsultancies(true);
                const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/consultancy`, {
                    method: 'GET',
                    headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
                });
                const result = await response.json();
                
                if (result.success) {
                    setConsultancies(result.consultancies || []);
                } else {
                    setSubmitStatus({ type: 'error', message: 'Failed to load consultancies. Please refresh the page.' });
                }
            } catch (error) {
                setSubmitStatus({ type: 'error', message: 'Failed to load consultancies. Please check your connection.' });
            } finally {
                setIsLoadingConsultancies(false);
            }
        };
        fetchConsultancies();
    }, [token]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.applicant_name.trim()) newErrors.applicant_name = 'Applicant name is required';
        if (!formData.applicant_email.trim()) {
            newErrors.applicant_email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.applicant_email)) {
            newErrors.applicant_email = 'Please enter a valid email address';
        }
        if (!formData.application_type) newErrors.application_type = 'Application type is required';
        if (!formData.consultancy) newErrors.consultancy = 'Please select a consultancy';
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;

        setIsSubmitting(true);
        setSubmitStatus(null);

        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/applications`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify(formData)
            });
            const result = await response.json();

            if (result.success) {
                setSubmitStatus({ type: 'success', message: 'Application created successfully!' });
                setFormData({ applicant_name: '', applicant_email: '', application_type: '', consultancy: '' });
                setErrors({});
            } else {
                setSubmitStatus({ type: 'error', message: result.message || 'Failed to create application. Please try again.' });
            }
        } catch (error) {
            setSubmitStatus({ type: 'error', message: 'Failed to create application. Please check your connection and try again.' });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex flex-col w-full overflow-auto bg-gray-50 min-h-screen">
            <div className="bg-white border-b border-gray-200 px-6 py-6">
                <h1 className="text-2xl font-bold text-gray-900">Create New Application</h1>
                <p className="text-gray-600 mt-1">Start a new immigration application by filling out the form below</p>
            </div>

            <div className="p-6">
                <div className="max-w-2xl mx-auto">
                    {submitStatus && (
                        <div className={`mb-6 p-4 rounded-lg border ${submitStatus.type === 'success' ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                            <div className="flex items-center space-x-2">
                                {submitStatus.type === 'success' ? <CheckCircle size={20} className="text-green-600" /> : <AlertCircle size={20} className="text-red-600" />}
                                <p className={`text-sm font-medium ${submitStatus.type === 'success' ? 'text-green-900' : 'text-red-900'}`}>
                                    {submitStatus.message}
                                </p>
                            </div>
                        </div>
                    )}

                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                        <div className="space-y-6">
                            <div>
                                <label htmlFor="applicant_name" className="block text-sm font-medium text-gray-700 mb-2">
                                    <User size={16} className="inline mr-2" />Applicant Name
                                </label>
                                <input
                                    type="text"
                                    id="applicant_name"
                                    name="applicant_name"
                                    value={formData.applicant_name}
                                    onChange={handleInputChange}
                                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${errors.applicant_name ? 'border-red-300' : 'border-gray-300'}`}
                                    placeholder="Enter applicant's full name"
                                />
                                {errors.applicant_name && <p className="mt-1 text-sm text-red-600">{errors.applicant_name}</p>}
                            </div>

                            <div>
                                <label htmlFor="applicant_email" className="block text-sm font-medium text-gray-700 mb-2">
                                    <Mail size={16} className="inline mr-2" />Applicant Email
                                </label>
                                <input
                                    type="email"
                                    id="applicant_email"
                                    name="applicant_email"
                                    value={formData.applicant_email}
                                    onChange={handleInputChange}
                                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${errors.applicant_email ? 'border-red-300' : 'border-gray-300'}`}
                                    placeholder="Enter applicant's email address"
                                />
                                {errors.applicant_email && <p className="mt-1 text-sm text-red-600">{errors.applicant_email}</p>}
                            </div>

                            <div>
                                <label htmlFor="application_type" className="block text-sm font-medium text-gray-700 mb-2">
                                    <FileText size={16} className="inline mr-2" />Application Type
                                </label>
                                <select
                                    id="application_type"
                                    name="application_type"
                                    value={formData.application_type}
                                    onChange={handleInputChange}
                                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${errors.application_type ? 'border-red-300' : 'border-gray-300'}`}
                                >
                                    <option value="">Select application type</option>
                                    {applicationTypes.map((type) => (
                                        <option key={type.value} value={type.value}>{type.icon} {type.label}</option>
                                    ))}
                                </select>
                                {errors.application_type && <p className="mt-1 text-sm text-red-600">{errors.application_type}</p>}
                            </div>

                            <div>
                                <label htmlFor="consultancy" className="block text-sm font-medium text-gray-700 mb-2">
                                    <Building size={16} className="inline mr-2" />Consultancy
                                </label>
                                <select
                                    id="consultancy"
                                    name="consultancy"
                                    value={formData.consultancy}
                                    onChange={handleInputChange}
                                    disabled={isLoadingConsultancies}
                                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${errors.consultancy ? 'border-red-300' : 'border-gray-300'} ${isLoadingConsultancies ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                                >
                                    <option value="">{isLoadingConsultancies ? 'Loading consultancies...' : 'Select consultancy'}</option>
                                    {consultancies.map((consultancy) => (
                                        <option key={consultancy._id} value={consultancy._id}>{consultancy.name}</option>
                                    ))}
                                </select>
                                {errors.consultancy && <p className="mt-1 text-sm text-red-600">{errors.consultancy}</p>}
                                {isLoadingConsultancies && (
                                    <div className="flex items-center mt-2">
                                        <Loader size={14} className="animate-spin mr-2 text-gray-500" />
                                        <p className="text-xs text-gray-500">Loading consultancies from server...</p>
                                    </div>
                                )}
                            </div>

                            <div className="pt-4 border-t border-gray-200">
                                <button
                                    onClick={handleSubmit}
                                    disabled={isSubmitting}
                                    className={`w-full inline-flex items-center justify-center px-4 py-2 rounded-lg text-sm font-medium transition-colors ${isSubmitting ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'} text-white`}
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader size={16} className="animate-spin mr-2" />
                                            Creating Application...
                                        </>
                                    ) : (
                                        <>
                                            <Save size={16} className="mr-2" />
                                            Create Application
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <div className="flex items-start space-x-2">
                            <AlertCircle size={16} className="text-blue-600 mt-0.5" />
                            <div>
                                <h4 className="text-sm font-medium text-blue-900">Getting Started</h4>
                                <p className="text-sm text-blue-800 mt-1">
                                    Once you create an application, you'll be able to track its progress, upload required documents, 
                                    and complete assigned tasks through your dashboard.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};