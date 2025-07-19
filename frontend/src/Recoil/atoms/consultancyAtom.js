import { atom, selector } from "recoil";
import { authAtom } from "./authAtom";
import axios from "axios";

export const consultancyAtom = atom({
    key : "consultancyAtom",
    default: selector({
        key : "asyncConsultancySelector",
        get : async({get}) => {
            const auth = get(authAtom);
            const token = auth?.token;

            if(!token){
                return {};
            }

            try{
                const consultancy = await axios.get(
                `${import.meta.env.VITE_BACKEND_URL}/consultancy/info`,
                {
                    headers : {
                        Authorization : `Bearer ${token}`
                    }
                }
            )

                return consultancy.data;
            }
            catch(err){
                console.log("Error Fetching Consultancy");
                return{};
            }
        }
    })
})