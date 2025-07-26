import { atom, selector, selectorFamily } from "recoil";
import { authAtom } from "./authAtom";
import axios from "axios";

// Main checklist atom
export const checklistAtom = atom({
    key: "checklistAtom",
    default: selector({
        key: "asyncChecklistSelector",
        get: async ({ get }) => {
            const auth = get(authAtom);
            const token = auth?.token;
            
            if (!token) {
                return [];
            }
            
            try {
                const backend_url = import.meta.env.VITE_BACKEND_URL;
                const response = await axios.get(`${backend_url}/checklists`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                return response.data.checklists;
            } catch (error) {
                console.error("Error fetching checklists:", error);
                return [];
            }
        }
    })
});

