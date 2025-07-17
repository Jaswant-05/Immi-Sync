import { Check } from "lucide-react";

export function PriceCard({ title, price, description, features, buttonText, highlighted, index }) {
  return (
    <div 
      className={`relative group ${
        highlighted ? 'scale-105 z-10' : ''
      } transform hover:scale-105 transition-all duration-500`}
      style={{ animationDelay: `${index * 150}ms` }}
    >
      {highlighted && (
        <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 z-20">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-2 rounded-full text-sm font-medium shadow-lg">
            Most Popular
          </div>
        </div>
      )}
      
      <div className={`relative h-full p-8 rounded-3xl shadow-xl border transition-all duration-500 group-hover:shadow-2xl ${
        highlighted 
          ? 'bg-white/10 backdrop-blur-sm border-blue-400/30 shadow-blue-500/20' 
          : 'bg-white/5 backdrop-blur-sm border-white/10 hover:border-blue-400/20'
      }`}>
        {/* Background decoration for highlighted card */}
        {highlighted && (
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent rounded-3xl"></div>
        )}
        
        <div className="relative z-10">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-white mb-4">{title}</h3>
            <div className="mb-2">
              <span className="text-5xl font-bold text-white">{price}</span>
              {price !== "Custom" && <span className="text-blue-200 ml-2">/month</span>}
            </div>
            <p className="text-blue-200">{description}</p>
          </div>
          
          <ul className="space-y-4 mb-8">
            {features.map((feature, featureIndex) => (
              <li key={featureIndex} className="flex items-start gap-3">
                <div className="flex-shrink-0 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center mt-0.5">
                  <Check className="w-3 h-3 text-white" />
                </div>
                <span className="text-blue-100">{feature}</span>
              </li>
            ))}
          </ul>
          
          <button
            className={`w-full py-3 px-4 rounded-xl font-semibold transition-all duration-300 ${
              highlighted
                ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl'
                : 'bg-white/10 text-white border border-white/20 hover:bg-white/20 backdrop-blur-sm'
            }`}
          >
            {buttonText}
          </button>
        </div>
      </div>
    </div>
  );
}