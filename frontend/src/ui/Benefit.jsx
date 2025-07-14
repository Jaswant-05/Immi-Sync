import { Clock, Globe2, Shield } from "lucide-react";
import { BenefitItem } from "./BenefitItem";


export const Benefit = () => {
    return (
        <div className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center px-4 py-1.5 bg-blue-100 rounded-full mb-4">
                <span className="text-sm text-blue-600 font-medium">Benefits</span>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Transform Your Immigration Practice
              </h2>
              <div className="space-y-6">
                <BenefitItem
                  icon={<Globe2 className="w-6 h-6 text-blue-600" />}
                  title="Global Accessibility"
                  description="Access your practice from anywhere in the world"
                />
                <BenefitItem
                  icon={<Shield className="w-6 h-6 text-blue-600" />}
                  title="Bank-Level Security"
                  description="Your data is protected with enterprise-grade encryption"
                />
                <BenefitItem
                  icon={<Clock className="w-6 h-6 text-blue-600" />}
                  title="Save Time"
                  description="Automate repetitive tasks and focus on what matters"
                />
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-lg transform rotate-3"></div>
              <img
                src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-4.0.3"
                alt="Immigration consultancy team"
                className="rounded-lg shadow-xl relative"
              />
            </div>
          </div>
        </div>
      </div>
    )
};