import { FeatureCard } from "../components/FeatureCard";
import { features } from "../utils/features";


export const Feature = () => {
    return(
        <section className="bg-gray-50 py-24">
            <div className="max-w-7xl mx-auto flex flex-col justify-center items-center">
                <div className="bg-blue-100 rounded-full px-4 py-2 text-sm text-blue-600 mb-4">
                    <span>
                        Features
                    </span>
                </div>
                <div className="text-3xl font-semibold mb-4 text-center">
                    <span>
                        Everything You Need in One Place
                    </span>
                </div>
                <div className="text-lg text-gray-500 text-center mb-8">
                    <span>
                        Powerful features to transform your immigration consultancy
                    </span>
                </div>
                <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-8">
                {features.map((feature, index) => (
                    <FeatureCard key={index} {...feature} />
                ))}
                </div>  
            </div>
    
        </section>
    )
};
