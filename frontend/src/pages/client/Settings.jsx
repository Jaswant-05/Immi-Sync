import { useState } from 'react';
import { Lock, Save, AlertCircle, CheckCircle, Loader } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { PasswordInput } from '../../ui/PasswordInput'; 

export const ClientSettings = () => {
    const { token, user } = useAuth();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState(null);
    const [showPasswords, setShowPasswords] = useState({ oldPassword: false, newPassword: false, confirmPassword: false });
    const [formData, setFormData] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' });
    const [errors, setErrors] = useState({});

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
        setSubmitStatus(null);
    };

    const togglePasswordVisibility = (field) => {
        setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }));
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.oldPassword) newErrors.oldPassword = 'Current password is required';
        if (!formData.newPassword) newErrors.newPassword = 'New password is required';
        // else if (formData.newPassword.length < 6) newErrors.newPassword = 'New password must be at least 6 characters';
        if (!formData.confirmPassword) newErrors.confirmPassword = 'Please confirm your new password';
        else if (formData.newPassword !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;

        setIsSubmitting(true);
        setSubmitStatus(null);
        setErrors({});

        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/auth/change-password`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({
                    userId: user?.id || user?._id,
                    oldPassword: formData.oldPassword,
                    newPassword: formData.newPassword
                })
            });

            const result = await response.json();

            if (response.ok) {
                setSubmitStatus({ type: 'success', message: result.message || 'Password changed successfully!' });
                setFormData({ oldPassword: '', newPassword: '', confirmPassword: '' });
            } else {
                setSubmitStatus({ type: 'error', message: result.message || 'Failed to change password.' });
            }
        } catch (error) {
            setSubmitStatus({ type: 'error', message: 'Network error. Please check your connection.' });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex flex-col w-full overflow-auto bg-gray-50 min-h-screen">
            <div className="bg-white border-b border-gray-200 px-6 py-6">
                <h1 className="text-2xl font-bold text-gray-900">Account Settings</h1>
                <p className="text-gray-600 mt-1">Manage your account security</p>
            </div>

            <div className="p-6">
                <div className="max-w-xl mx-auto">
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
                        <div className="flex items-center space-x-3 mb-6">
                            <div className="p-2 bg-indigo-100 rounded-lg">
                                <Lock size={20} className="text-indigo-600" />
                            </div>
                            <div>
                                <h2 className="text-lg font-semibold text-gray-900">Change Password</h2>
                                <p className="text-sm text-gray-600">Update your account password</p>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <PasswordInput 
                                name="oldPassword" 
                                label="Current Password" 
                                placeholder="Enter your current password"
                                value={formData.oldPassword}
                                onChange={handleInputChange}
                                showPassword={showPasswords.oldPassword}
                                onToggleVisibility={() => togglePasswordVisibility('oldPassword')}
                                error={errors.oldPassword}
                            />
                            <PasswordInput 
                                name="newPassword" 
                                label="New Password" 
                                placeholder="Enter your new password"
                                value={formData.newPassword}
                                onChange={handleInputChange}
                                showPassword={showPasswords.newPassword}
                                onToggleVisibility={() => togglePasswordVisibility('newPassword')}
                                error={errors.newPassword}
                            />
                            <PasswordInput 
                                name="confirmPassword" 
                                label="Confirm New Password" 
                                placeholder="Confirm your new password"
                                value={formData.confirmPassword}
                                onChange={handleInputChange}
                                showPassword={showPasswords.confirmPassword}
                                onToggleVisibility={() => togglePasswordVisibility('confirmPassword')}
                                error={errors.confirmPassword}
                            />

                            <div className="pt-4 border-t border-gray-200">
                                <button
                                    onClick={handleSubmit}
                                    disabled={isSubmitting}
                                    className={`w-full inline-flex items-center justify-center px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                        isSubmitting ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'
                                    } text-white`}
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader size={16} className="animate-spin mr-2" />
                                            Changing Password...
                                        </>
                                    ) : (
                                        <>
                                            <Save size={16} className="mr-2" />
                                            Change Password
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Commented out security tips for now */}
                    {/*
                    <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <div className="flex items-start space-x-2">
                            <AlertCircle size={16} className="text-yellow-600 mt-0.5" />
                            <div>
                                <h4 className="text-sm font-medium text-yellow-900">Security Tips</h4>
                                <ul className="text-sm text-yellow-800 mt-1 space-y-1">
                                    <li>• Use a strong password with at least 8 characters</li>
                                    <li>• Include uppercase, lowercase, numbers, and special characters</li>
                                    <li>• Don't reuse passwords from other accounts</li>
                                    <li>• Consider using a password manager</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    */}
                </div>
            </div>
        </div>
    );
};
