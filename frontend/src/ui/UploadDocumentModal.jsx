import { useState, useCallback, useRef } from 'react';
import { Upload, X, AlertCircle, Cloud } from 'lucide-react';
import { useRecoilValue } from 'recoil';
import { authAtom } from '../Recoil/atoms/authAtom';

export const UploadDocumentModal = ({ isOpen, onClose, document, onUploadSuccess }) => {
    const [dragActive, setDragActive] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [selectedFile, setSelectedFile] = useState(null);
    const [error, setError] = useState('');
    const fileInputRef = useRef(null);
    const auth = useRecoilValue(authAtom);

    const handleDrag = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    }, []);

    const handleDrop = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFile(e.dataTransfer.files[0]);
        }
    }, []);

    const handleChange = useCallback((e) => {
        e.preventDefault();
        if (e.target.files && e.target.files[0]) {
            handleFile(e.target.files[0]);
        }
    }, []);

    const handleFile = (file) => {
        setError('');
        
        // File validation
        const maxSize = 10 * 1024 * 1024; // 10MB
        const allowedTypes = [
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'image/jpeg',
            'image/jpg',
            'image/png'
        ];

        if (file.size > maxSize) {
            setError('File size must be less than 10MB');
            return;
        }

        if (!allowedTypes.includes(file.type)) {
            setError('Please upload PDF, DOC, DOCX, JPG, JPEG, or PNG files only');
            return;
        }

        setSelectedFile(file);
    };

    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const getFileIcon = (fileType) => {
        if (fileType.includes('pdf')) return '📄';
        if (fileType.includes('word') || fileType.includes('doc')) return '📝';
        if (fileType.includes('image')) return '🖼️';
        return '📎';
    };

    const handleUpload = async () => {
        if (!selectedFile) return;

        setUploading(true);
        setUploadProgress(0);
        setError('');

        try {
            const formData = new FormData();
            formData.append('file', selectedFile);

            const progressInterval = setInterval(() => {
                setUploadProgress(prev => {
                    if (prev >= 90) {
                        clearInterval(progressInterval);
                        return prev;
                    }
                    return prev + Math.random() * 30;
                });
            }, 100);

            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/documents/${document._id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${auth.token}`
                },
                body: formData
            });

            clearInterval(progressInterval);
            setUploadProgress(100);

            const result = await response.json();

            if (result.success) {
                setTimeout(() => {
                    setUploading(false);
                    setUploadProgress(0);
                    setSelectedFile(null);
                    onUploadSuccess?.(result.document);
                    onClose();
                }, 500);
            } else {
                throw new Error(result.message || 'Upload failed');
            }
        } catch (error) {
            console.error('Upload error:', error);
            setError(error.message || 'Failed to upload document. Please try again.');
            setUploading(false);
            setUploadProgress(0);
        }
    };

    const resetModal = () => {
        setSelectedFile(null);
        setError('');
        setUploadProgress(0);
        setUploading(false);
        setDragActive(false);
    };

    const handleClose = () => {
        if (!uploading) {
            resetModal();
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            {/* Backdrop */}
            <div className="fixed inset-0  backdrop-blur-sm backdrop-brightness-75 transition-opacity" onClick={handleClose} />
            
            {/* Modal */}
            <div className="flex min-h-full items-center justify-center p-4">
                <div className="relative w-full max-w-md transform rounded-lg bg-white shadow-xl transition-all">
                    {/* Header */}
                    <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
                        <div className="flex items-center space-x-3">
                            <div className="p-2 bg-indigo-100 rounded-lg">
                                <Upload size={20} className="text-indigo-600" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">Upload Document</h3>
                                <p className="text-sm text-gray-600">{document?.name}</p>
                            </div>
                        </div>
                        {!uploading && (
                            <button
                                onClick={handleClose}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <X size={20} className="text-gray-500" />
                            </button>
                        )}
                    </div>

                    {/* Content */}
                    <div className="p-6">
                        {!selectedFile ? (
                            <div
                                className={`
                                    relative border-2 border-dashed rounded-lg p-8 text-center transition-colors
                                    ${dragActive 
                                        ? 'border-indigo-500 bg-indigo-50' 
                                        : 'border-gray-300 hover:border-gray-400'
                                    }
                                `}
                                onDragEnter={handleDrag}
                                onDragLeave={handleDrag}
                                onDragOver={handleDrag}
                                onDrop={handleDrop}
                            >
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    onChange={handleChange}
                                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                                />
                                
                                <div className="space-y-4">
                                    <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                                        <Cloud size={32} className="text-gray-400" />
                                    </div>
                                    
                                    <div>
                                        <p className="text-lg font-medium text-gray-900">
                                            Drop your file here, or{' '}
                                            <button
                                                type="button"
                                                className="text-indigo-600 hover:text-indigo-700 font-semibold"
                                                onClick={() => fileInputRef.current?.click()}
                                            >
                                                browse
                                            </button>
                                        </p>
                                        <p className="text-sm text-gray-500 mt-2">
                                            Supports: PDF, DOC, DOCX, JPG, JPEG, PNG
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            Maximum file size: 10MB
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {/* Selected File */}
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <div className="flex items-center space-x-3">
                                        <div className="text-2xl">
                                            {getFileIcon(selectedFile.type)}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-gray-900 truncate">
                                                {selectedFile.name}
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                {formatFileSize(selectedFile.size)}
                                            </p>
                                        </div>
                                        {!uploading && (
                                            <button
                                                onClick={() => setSelectedFile(null)}
                                                className="p-1 hover:bg-gray-200 rounded"
                                            >
                                                <X size={16} className="text-gray-500" />
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {/* Upload Progress */}
                                {uploading && (
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600">Uploading...</span>
                                            <span className="text-gray-900 font-medium">{Math.round(uploadProgress)}%</span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                            <div 
                                                className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                                                style={{ width: `${uploadProgress}%` }}
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Error Message */}
                        {error && (
                            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                                <div className="flex items-center space-x-2">
                                    <AlertCircle size={16} className="text-red-600" />
                                    <p className="text-sm text-red-800">{error}</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="border-t border-gray-200 px-6 py-4">
                        <div className="flex space-x-3">
                            <button
                                onClick={handleClose}
                                disabled={uploading}
                                className={`
                                    flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium transition-colors
                                    ${uploading 
                                        ? 'text-gray-400 cursor-not-allowed' 
                                        : 'text-gray-700 hover:bg-gray-50'
                                    }
                                `}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleUpload}
                                disabled={!selectedFile || uploading}
                                className={`
                                    flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center space-x-2
                                    ${selectedFile && !uploading
                                        ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                    }
                                `}
                            >
                                {uploading ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                                        <span>Uploading...</span>
                                    </>
                                ) : (
                                    <>
                                        <Upload size={16} />
                                        <span>Upload</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};