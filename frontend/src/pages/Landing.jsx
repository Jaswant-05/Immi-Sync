import { Benefit } from "../landingcomponents/Benefit";
import { Feature } from "../landingcomponents/Feature";
import { Footer } from "../landingcomponents/Footer";
import { Hero } from "../landingcomponents/Hero";
import { Pricing } from "../landingcomponents/Pricing";

export const Landing = () =>{
    return(
        <>
            <Hero/>
            <Feature />
            <Benefit />
            <Pricing />
            <Footer />
    </>
    )
};
