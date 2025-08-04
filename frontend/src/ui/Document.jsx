import { Download, Eye, FileText, Upload } from "lucide-react";

export const Document = ({ document, onUpload, onView, onDownload, showUploadButton = true }) => {
    const getStatusColor = (uploaded) => {
        if (uploaded) {
            return 'bg-green-100 text-green-800 border-green-200';
        } else {
            return 'bg-red-100 text-red-800 border-red-200';
        }
    };

    const getStatusText = (uploaded) => {
        return uploaded ? 'Uploaded' : 'Missing';
    };

    const handleUpload = () => {
        if (onUpload) {
            onUpload(document);
        }
    };

    const handleView = () => {
        if (onView) {
            onView(document._id, document.url);
        }
    };

    const handleDownload = () => {
        if (onDownload) {
            onDownload(document._id, document.url, document.name);
        }
    };

    return (
        <div className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                    <FileText size={20} className="text-gray-600" />
                    <div>
                        <h4 className="font-medium text-gray-900 text-sm">{document.name}</h4>
                        {document.gcs_file_name && (
                            <p className="text-xs text-gray-500">File: {document.gcs_file_name}</p>
                        )}
                        {document.createdAt && (
                            <p className="text-xs text-gray-600">
                                Added {new Date(document.createdAt).toLocaleDateString()}
                            </p>
                        )}
                    </div>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(document.uploaded)}`}>
                    {getStatusText(document.uploaded)}
                </span>
            </div>
            <div className="flex space-x-2">
                {document.uploaded && document.url ? (
                    <>
                        <button
                            onClick={handleView}
                            className="flex-1 px-3 py-2 bg-gray-100 text-gray-700 rounded text-xs hover:bg-gray-200 transition-colors"
                        >
                            <Eye size={12} className="inline mr-1" />
                            View
                        </button>
                        <button
                            onClick={handleDownload}
                            className="px-3 py-2 bg-gray-100 text-gray-700 rounded text-xs hover:bg-gray-200 transition-colors"
                        >
                            <Download size={12} />
                        </button>
                    </>
                ) : showUploadButton ? (
                    <button
                        onClick={handleUpload}
                        className="flex-1 px-3 py-2 bg-indigo-600 text-white rounded text-xs hover:bg-indigo-700 transition-colors"
                    >
                        <Upload size={12} className="inline mr-1" />
                        Upload
                    </button>
                ) : null}
            </div>
        </div>
    );
};