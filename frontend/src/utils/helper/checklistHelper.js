import axios from "axios";

export const checklistOperations = {
    // Create new checklist
    createChecklist: async (token, checklistData) => {
        const response = await axios.post(
            `${import.meta.env.VITE_BACKEND_URL}/checklists`,
            checklistData,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            }
        );
        return response.data;
    },

    // Update checklist
    updateChecklist: async (token, checklistId, updateData) => {
        console.log(token, checklistId, updateData)
        const response = await axios.put(
            `${import.meta.env.VITE_BACKEND_URL}/checklists/${checklistId}`,
            updateData,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            }
        );
        return response.data;
    },

    // Add document to checklist
    addDocument: async (token, checklistId, documentData) => {
        const response = await axios.post(
            `${import.meta.env.VITE_BACKEND_URL}/checklists/${checklistId}/documents`,
            documentData,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            }
        );
        return response.data;
    },

    // Remove document from checklist
    removeDocument: async (token, checklistId, documentId) => {
        const response = await axios.delete(
            `${import.meta.env.VITE_BACKEND_URL}/checklists/${checklistId}/documents/${documentId}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );
        return response.data;
    },

    // Add task to checklist
    addTask: async (token, checklistId, taskData) => {
        const response = await axios.post(
            `${import.meta.env.VITE_BACKEND_URL}/checklists/${checklistId}/tasks`,
            taskData,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            }
        );
        return response.data;
    },

    // Remove task from checklist
    removeTask: async (token, checklistId, taskId) => {
        const response = await axios.delete(
            `${import.meta.env.VITE_BACKEND_URL}/checklists/${checklistId}/tasks/${taskId}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );
        return response.data;
    },

    // Assign checklist to application
    assignChecklist: async (token, checklistId, applicationId) => {
        const response = await axios.post(
            `${import.meta.env.VITE_BACKEND_URL}/checklists/${checklistId}/assign`,
            { application: applicationId },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            }
        );
        return response.data;
    },

    // Delete checklist
    deleteChecklist: async (token, checklistId) => {
        const response = await axios.delete(
            `${import.meta.env.VITE_BACKEND_URL}/checklists/${checklistId}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );
        return response.data;
    }
};