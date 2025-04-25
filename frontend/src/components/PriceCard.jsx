import { Check } from "lucide-react";

export function PriceCard({ title, price, description, features, buttonText, highlighted }) {
    return (
      <div className={`relative ${highlighted ? 'bg-blue-50' : 'bg-white'} p-8 rounded-xl shadow-sm border ${highlighted ? 'border-blue-200' : 'border-gray-100'} hover:shadow-xl transition-all duration-300 hover:-translate-y-1`}>
        {highlighted && (
          <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
            <div className="bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-medium">
              Most Popular
            </div>
          </div>
        )}
        <div className="text-center mb-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
          <div className="text-4xl font-bold text-gray-900 mb-2">{price}</div>
          <p className="text-sm text-gray-600">{description}</p>
        </div>
        <ul className="space-y-4 mb-8">
          {features.map((feature, index) => (
            <li key={index} className="flex items-center gap-3">
              <Check className="w-5 h-5 text-blue-600" />
              <span className="text-gray-600">{feature}</span>
            </li>
          ))}
        </ul>
        <button className={`w-full py-3 px-4 rounded-lg font-semibold transition-all duration-300 ${
          highlighted 
            ? 'bg-blue-600 text-white hover:bg-blue-700' 
            : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
        }`}>
          {buttonText}
        </button>
      </div>
    );
  }