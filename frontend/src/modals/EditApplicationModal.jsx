import { useEffect, useState } from "react";
import { XCircle } from "lucide-react";

export const EditApplicationModal = ({ isOpen, onClose, onSubmit, application }) => {
  const [formData, setFormData] = useState({
    applicant_name: application?.applicant_name || '',
    applicant_email: application?.applicant_email || '',
    application_type: application?.application_type || '',
    application_status: application?.application_status || ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (application) {
      setFormData({
        applicant_name: application.applicant_name || '',
        applicant_email: application.applicant_email || '',
        application_type: application.application_type || '',
        application_status: application.application_status || ''
      });
    }
  }, [application]);

  if (!isOpen || !application) return null;

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.applicant_name.trim()) {
      newErrors.applicant_name = 'Full name is required';
    }
    
    if (!formData.applicant_email.trim()) {
      newErrors.applicant_email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.applicant_email)) {
      newErrors.applicant_email = 'Please enter a valid email address';
    }
    
    if (!formData.application_type) {
      newErrors.application_type = 'Application type is required';
    }
    
    if (!formData.application_status) {
      newErrors.application_status = 'Application status is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      const updatedApplication = {
        ...application,
        ...formData,
        updatedAt: new Date().toISOString()
      };
      onSubmit(updatedApplication);
      onClose();
    }
  };

  const handleCancel = () => {
    setFormData({
      applicant_name: application?.applicant_name || '',
      applicant_email: application?.applicant_email || '',
      application_type: application?.application_type || '',
      application_status: application?.application_status || ''
    });
    setErrors({});
    onClose();
  };

  return (
    <div className="fixed inset-0 backdrop-blur-sm backdrop-brightness-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">Edit Application</h2>
            <button
              onClick={handleCancel}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <XCircle size={24} />
            </button>
          </div>
        </div>
        
        <div className="p-6">
          <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
            {/* Applicant Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Applicant Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={formData.applicant_name}
                    onChange={(e) => handleInputChange('applicant_name', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                      errors.applicant_name ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter full name"
                  />
                  {errors.applicant_name && (
                    <p className="mt-1 text-sm text-red-600">{errors.applicant_name}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={formData.applicant_email}
                    onChange={(e) => handleInputChange('applicant_email', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                      errors.applicant_email ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter email address"
                  />
                  {errors.applicant_email && (
                    <p className="mt-1 text-sm text-red-600">{errors.applicant_email}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Application Details */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Application Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Application Type *
                  </label>
                  <select
                    value={formData.application_type}
                    onChange={(e) => handleInputChange('application_type', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                      errors.application_type ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Select application type</option>
                    <option value="Visitor">Visitor Visa</option>
                    <option value="Work">Work Permit</option>
                    <option value="PR">Permanent Residence</option>
                    <option value="citizenship">Citizenship</option>
                    <option value="other">Other</option>
                  </select>
                  {errors.application_type && (
                    <p className="mt-1 text-sm text-red-600">{errors.application_type}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Application Status *
                  </label>
                  <select
                    value={formData.application_status}
                    onChange={(e) => handleInputChange('application_status', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                      errors.application_status ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Select status</option>
                    <option value="Draft">Draft</option>
                    <option value="Applied">Applied</option>
                    <option value="Approved">Approved</option>
                    <option value="Declined">Declined</option>
                  </select>
                  {errors.application_status && (
                    <p className="mt-1 text-sm text-red-600">{errors.application_status}</p>
                  )}
                </div>
              </div>
            </div>
          </form>
          
          <div className="mt-8 flex justify-end space-x-3">
            <button
              onClick={handleCancel}
              className="px-6 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
            >
              Update Application
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};