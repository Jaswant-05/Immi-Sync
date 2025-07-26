import { selectorFamily } from "recoil";
import { checklistAtom } from "../atoms/checklistAtom";

export const checklistByApplicationSelector = selectorFamily({
    key: "checklistByApplicationSelector",
    get: (applicationId) => ({ get }) => {
        const allChecklists = get(checklistAtom);
        
        if (!applicationId || !Array.isArray(allChecklists)) {
            return null;
        }
        
        return allChecklists.find(checklist => 
            checklist.application === applicationId || 
            checklist.application?._id === applicationId
        ) || null;
    }
});