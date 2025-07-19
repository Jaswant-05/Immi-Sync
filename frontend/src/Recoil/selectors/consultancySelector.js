import { selector } from "recoil";
import { consultancyAtom } from "../atoms/consultancyAtom";
import { applicationsAtom } from "../atoms/applicationsAtom";

export const totalUserSelector = selector({
    key : "totalUserSelector",
    get : ({get}) => {
        const consultancy = get(consultancyAtom);
        if(!consultancy || !consultancy.users){
            return 0;
        }

        return consultancy.users.length;
    }
});

export const allApplicationCountsSelector = selector({
  key: "allApplicationCountsSelector",
  get: ({ get }) => {
    const applications = get(applicationsAtom);
    if (applications.length === 0) {
      return {
        totalApplied: 0,
        totalDraft: 0,
        totalApproved: 0,
      };
    }

    const counts = {
      totalApplied: 0,
      totalDraft: 0,
      totalApproved: 0,
    };

    for (const app of applications) {
      if (app.application_status === "Applied") counts.totalApplied++;
      else if (app.application_status === "Draft") counts.totalDraft++;
      else if (app.application_status === "Approved") counts.totalApproved++;
    }

    return counts;
  },
});

export const recentApplicationsSelector = selector({
    key: "recentApplicationsSelector",
    get: ({ get }) => {
        const applications = get(applicationsAtom);
        
        if (!Array.isArray(applications)) {
            return [];
        }

        return [...applications]
            .sort((a, b) => {
                const dateA = new Date(a.created_at || a.date || a.createdAt || 0);
                const dateB = new Date(b.created_at || b.date || b.createdAt || 0);
                return dateB - dateA;
            })
            .slice(0, 10);
    }
});