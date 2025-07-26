import axios from "axios";
import { atom, selector } from "recoil";
import { authAtom } from "./authAtom";

export const applicationsAtom = atom({
  key: "applicationAtom",
  default: selector({
    key: "asyncApplicationSelector",
    get: async ({ get }) => {
      const auth = get(authAtom);
      const token = auth?.token;

      if (!token) return [];

      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/consultancy/applications`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        return response.data;
      } catch (error) {
        console.error("Failed to fetch applications", error);
        return [];
      }
    },
  }),
});


