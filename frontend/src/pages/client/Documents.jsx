import { useRecoilValue } from "recoil"
import { currentApplicationAtom } from "../../Recoil/atoms/currentApplicationAtom"
import { useEffect, useMemo, useState } from "react";
import { UploadDocumentModal } from "../../ui/UploadDocumentModal";
import { FileText, FolderOpen } from "lucide-react";
import { Document } from "../../ui/Document";

export const ClientDocuments = () => {
    const activeApplication = useRecoilValue(currentApplicationAtom);
    const [uploadModalOpen, setUploadModalOpen] = useState(false);
    const [selectedDocument, setSelectedDocument] = useState(null);
    
    const checklistDocuments = useMemo(() => {
        return activeApplication?.checklist?.documents || [];
    }, [activeApplication]);

    const applicationDocuments = useMemo(() => {
        return activeApplication?.documents || [];
    }, [activeApplication]);

    const handleUploadClick = (document) => {
        setSelectedDocument(document);
        setUploadModalOpen(true);
    };

    const handleUploadSuccess = (updatedDocument) => {
        window.location.reload(); 
    };

    const onView = (documentId, documentUrl) => {
        if (documentUrl) {
            window.open(documentUrl, '_blank');
        } else {
            alert('Document not available for viewing');
        }
    };

    const onDownload = (documentId, documentUrl, documentName) => {
        if (documentUrl) {
            const link = document.createElement('a');
            link.href = documentUrl;
            link.download = documentName || 'document';
            link.target = '_blank';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } else {
            alert('Document not available for download');
        }
    };

    if (!activeApplication) {
        return (
            <div className="flex flex-col w-full overflow-auto bg-gray-50 min-h-screen">
                <div className="flex items-center justify-center h-64">
                    <div className="text-center">
                        <FileText size={48} className="text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Active Application</h3>
                        <p className="text-gray-600">Please select an application to view documents</p>
                    </div>
                </div>
            </div>
        );
    }

    // Calculate stats
    const checklistUploadedDocs = checklistDocuments.filter(doc => doc.uploaded).length;
    const applicationUploadedDocs = applicationDocuments.filter(doc => doc.uploaded).length;

    return (
        <div className="flex flex-col w-full overflow-auto bg-gray-50 min-h-screen">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 px-6 py-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            Documents - {activeApplication.applicant_name}
                        </h1>
                        <p className="text-gray-600 mt-1">
                            Manage and upload required documents for your {activeApplication.application_type} application
                        </p>
                    </div>
                </div>
            </div>

            <div className="p-6 space-y-6">
                {/* Checklist Documents Section */}
                {checklistDocuments.length > 0 && (
                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-semibold text-gray-900">Checklist Documents</h3>
                            <span className="text-sm text-gray-600">
                                {checklistUploadedDocs}/{checklistDocuments.length} uploaded
                            </span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {checklistDocuments.map((doc, index) => (
                                <Document 
                                    key={doc._id || index} 
                                    document={doc} 
                                    onUpload={handleUploadClick}
                                    onView={onView}
                                    onDownload={onDownload}
                                    showUploadButton={true}
                                />
                            ))}
                        </div>
                    </div>
                )}

                {/* Application Documents Section */}
                {applicationDocuments.length > 0 && (
                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-semibold text-gray-900">Application Documents</h3>
                            <span className="text-sm text-gray-600">
                                {applicationUploadedDocs}/{applicationDocuments.length} uploaded
                            </span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {applicationDocuments.map((doc, index) => (
                                <Document 
                                    key={doc._id || index} 
                                    document={doc} 
                                    onUpload={handleUploadClick}
                                    onView={onView}
                                    onDownload={onDownload}
                                    showUploadButton={true}
                                />
                            ))}
                        </div>
                    </div>
                )}

                {/* No Documents State */}
                {checklistDocuments.length === 0 && applicationDocuments.length === 0 && (
                    <div className="bg-white rounded-lg border border-gray-200 p-12">
                        <div className="text-center">
                            <FolderOpen size={64} className="text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Documents Available</h3>
                            <p className="text-gray-600">
                                No documents have been assigned to this application yet. 
                                Check back later or contact support for assistance.
                            </p>
                        </div>
                    </div>
                )}
            </div>

            {/* Upload Modal */}
            <UploadDocumentModal
                isOpen={uploadModalOpen}
                onClose={() => {
                    setUploadModalOpen(false);
                    setSelectedDocument(null);
                }}
                document={selectedDocument}
                onUploadSuccess={handleUploadSuccess}
            />
        </div>
    );
};