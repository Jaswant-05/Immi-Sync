export const getUploadedDocuments = (documents) => {
    const uploadedDocuments = documents.filter(document => document.uploaded === true)
    return uploadedDocuments.length
}