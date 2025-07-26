import { useState, useRef, useEffect } from 'react';
import { useLoadScript } from "@react-google-maps/api";
import { useForm, useController } from "react-hook-form";
import axios from 'axios';
import {
    Settings as SettingsIcon,
    Save,
    MapPin,
    Phone,
    Building,
    User,
    AlertCircle,
    CheckCircle,
    Loader2
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const libraries = ["places"];

export const Settings = () => {
    const { register, handleSubmit, control, formState: { errors }, setValue } = useForm();
    const [geometry, setGeometry] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [submitMessage, setSubmitMessage] = useState({ type: '', text: '' });
    const [consultancyData, setConsultancyData] = useState(null);
    const inputRef = useRef(null);
    const { token } = useAuth();
  
    const { field: addressField } = useController({
        name: "address",
        control,
        rules: { required: "Address is required" }
    });

    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
        libraries,
    });

    useEffect(() => {
        const fetchConsultancyData = async () => {
            try {
                setIsLoading(true);
                const response = await axios.get(
                    `${import.meta.env.VITE_BACKEND_URL}/consultancy/info`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        }
                    }
                );


                if (response.data) {
                    const data = response.data;
                    setConsultancyData(data);
                    console.log(data);
                    
                    setValue('name', data.name);
                    setValue('phoneNumber', data.phoneNumber);
                    setValue('address', data.address?.address);
                    
                    if (data.address?.latitude && data.address?.longitude) {
                        setGeometry({
                            lat: data.address.latitude,
                            lng: data.address.longitude
                        });
                    }
                }
            } catch (error) {
                console.error('Error fetching consultancy data:', error);
                setSubmitMessage({
                    type: 'error',
                    text: 'Failed to load consultancy information'
                });
            } finally {
                setIsLoading(false);
            }
        };

        if (token) {
            fetchConsultancyData();
        }
    }, [token, setValue]);

    useEffect(() => {
        if (!isLoaded || !inputRef.current) return;
        
        const autocomplete = new window.google.maps.places.Autocomplete(inputRef.current, {
            types: ["address"],
            fields: ["formatted_address", "geometry"],
        });

        autocomplete.addListener("place_changed", () => {
            const place = autocomplete.getPlace();
            
            if (place.geometry) {
                setGeometry({
                    lat: place.geometry.location.lat(),
                    lng: place.geometry.location.lng(),
                    viewport: place.geometry.viewport,
                });
            }
        
            if (place.formatted_address) {
                addressField.onChange(place.formatted_address);
            }
        });
    }, [isLoaded, addressField]);

    const onSubmit = async (data) => {
        try {
            setIsSubmitting(true);
            setSubmitMessage({ type: '', text: '' });
            
            const payload = {
                name: data.name,
                phoneNumber: parseInt(data.phoneNumber),
                address: {
                    addressString: data.address,
                    longitude: geometry.lng || null,
                    latitude: geometry.lat || null
                }
            };
            
            const response = await axios.put(
                `${import.meta.env.VITE_BACKEND_URL}/consultancy/update`,
                payload,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );
            
            if (response.data.success) {
                setConsultancyData(response.data.consultancy);
                setSubmitMessage({
                    type: 'success',
                    text: 'Consultancy information updated successfully!'
                });
            }
            
        } catch (error) {
            console.error('Update failed:', error);
            
            let errorMessage = 'Failed to update consultancy information';
            if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
            } else if (error.request) {
                errorMessage = 'Network error. Please check your connection.';
            }
            
            setSubmitMessage({
                type: 'error',
                text: errorMessage
            });
        } finally {
            setIsSubmitting(false);
            setTimeout(() => {
                setSubmitMessage({ type: '', text: '' });
            }, 5000);
        }
    };

    if (loadError) {
        return (
            <div className="flex flex-col w-full overflow-auto bg-gray-50 min-h-screen">
                <div className="flex items-center justify-center h-64">
                    <div className="text-center">
                        <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                        <p className="text-gray-500">Failed to load Google Maps</p>
                    </div>
                </div>
            </div>
        );
    }

    if (!isLoaded || isLoading) {
        return (
            <div className="flex flex-col w-full overflow-auto bg-gray-50 min-h-screen">
                <div className="flex items-center justify-center h-64">
                    <div className="text-center">
                        <Loader2 className="h-12 w-12 text-indigo-500 mx-auto mb-4 animate-spin" />
                        <p className="text-gray-500">Loading settings...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col w-full overflow-auto bg-gray-50 min-h-screen">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 px-6 py-4">
                <div className="flex items-center">
                    <SettingsIcon className="h-6 w-6 text-gray-700 mr-3" />
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
                        <p className="text-gray-600 mt-1">Manage your consultancy information</p>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="p-6">
                <div className="max-w-2xl">
                    {/* Current Status Card */}
                    {consultancyData && (
                        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">Current Information</h2>
                            <div className="space-y-3">
                                <div className="flex items-center">
                                    <Building className="h-5 w-5 text-gray-500 mr-3" />
                                    <div>
                                        <span className="text-sm text-gray-600">Name: </span>
                                        <span className="font-medium">{consultancyData.name || 'Not set'}</span>
                                    </div>
                                </div>
                                <div className="flex items-center">
                                    <Phone className="h-5 w-5 text-gray-500 mr-3" />
                                    <div>
                                        <span className="text-sm text-gray-600">Phone: </span>
                                        <span className="font-medium">{consultancyData.phoneNumber || 'Not set'}</span>
                                    </div>
                                </div>
                                <div className="flex items-start">
                                    <MapPin className="h-5 w-5 text-gray-500 mr-3 mt-0.5" />
                                    <div>
                                        <span className="text-sm text-gray-600">Address: </span>
                                        <span className="font-medium">{consultancyData.address?.address || 'Not set'}</span>
                                    </div>
                                </div>
                                <div className="flex items-center">
                                    <User className="h-5 w-5 text-gray-500 mr-3" />
                                    <div>
                                        <span className="text-sm text-gray-600">Status: </span>
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                            consultancyData.status === 'verified' 
                                                ? 'bg-green-100 text-green-800' 
                                                : consultancyData.status === 'unverified'
                                                ? 'bg-yellow-100 text-yellow-800'
                                                : 'bg-gray-100 text-gray-800'
                                        }`}>
                                            {consultancyData.status}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Update Form */}
                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-6">Update Information</h2>
                        
                        {submitMessage.text && (
                            <div className={`p-4 rounded-lg mb-6 flex items-center ${
                                submitMessage.type === 'success' 
                                    ? 'bg-green-50 border border-green-200' 
                                    : 'bg-red-50 border border-red-200'
                            }`}>
                                {submitMessage.type === 'success' ? (
                                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                                ) : (
                                    <AlertCircle className="h-5 w-5 text-red-500 mr-3" />
                                )}
                                <p className={`text-sm ${
                                    submitMessage.type === 'success' ? 'text-green-700' : 'text-red-700'
                                }`}>
                                    {submitMessage.text}
                                </p>
                            </div>
                        )}
                        
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                            {/* Name Field */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Consultancy Name *
                                </label>
                                <input
                                    type="text"
                                    {...register('name', {
                                        required: 'Consultancy name is required',
                                        minLength: {
                                            value: 2,
                                            message: 'Name must be at least 2 characters'
                                        }
                                    })}
                                    className="block w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                                    placeholder="Enter consultancy name"
                                />
                                {errors.name && (
                                    <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>
                                )}
                            </div>

                            {/* Phone Number Field */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Phone Number *
                                </label>
                                <input
                                    type="tel"
                                    {...register('phoneNumber', {
                                        required: 'Phone number is required',
                                        pattern: {
                                            value: /^[\+]?[1-9][\d]{0,15}$/,
                                            message: 'Please enter a valid phone number'
                                        }
                                    })}
                                    className="block w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                                    placeholder="Enter phone number"
                                />
                                {errors.phoneNumber && (
                                    <p className="text-sm text-red-500 mt-1">{errors.phoneNumber.message}</p>
                                )}
                            </div>

                            {/* Address Field */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Address *
                                </label>
                                <input
                                    {...addressField}
                                    ref={inputRef}
                                    type="text"
                                    placeholder="Start typing your address..."
                                    className="block w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    Please select from the dropdown suggestions
                                </p>
                                {errors.address && (
                                    <p className="text-sm text-red-500 mt-1">{errors.address.message}</p>
                                )}
                            </div>

                            {/* Submit Button */}
                            <div className="flex justify-end pt-4">
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className={`inline-flex items-center px-6 py-3 rounded-lg text-sm font-medium transition-colors ${
                                        isSubmitting
                                            ? 'bg-indigo-400 cursor-not-allowed'
                                            : 'bg-indigo-600 hover:bg-indigo-700'
                                    } text-white`}
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                            Updating...
                                        </>
                                    ) : (
                                        <>
                                            <Save className="w-4 h-4 mr-2" />
                                            Update Information
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};