import { Clock, Globe2, Shield, Star } from "lucide-react";
import { BenefitItem } from "./BenefitItem";

export const Benefit = () => {
  const benefits = [
    {
      icon: <Globe2 className="w-6 h-6 text-white" />,
      title: "Global Accessibility",
      description: "Access your practice from anywhere in the world with our cloud-based platform that never sleeps."
    },
    {
      icon: <Shield className="w-6 h-6 text-white" />,
      title: "Bank-Level Security",
      description: "Your data is protected with enterprise-grade encryption and compliance with international standards."
    },
    {
      icon: <Clock className="w-6 h-6 text-white" />,
      title: "Save Time",
      description: "Automate repetitive tasks and focus on what matters most - helping your clients achieve their dreams."
    }
  ];

  return (
     <section className="py-32 bg-gradient-to-b from-slate-900 to-slate-800 relative overflow-hidden">
      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDU5LDEzMCwyNDYsMC4xKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-20"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="inline-flex items-center px-6 py-2 rounded-full bg-blue-500/10 border border-blue-400/20 backdrop-blur-sm mb-6">
              <span className="text-blue-300 font-medium">Benefits</span>
            </div>
            
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-8 leading-tight">
              Transform Your{" "}
              <span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
                Immigration Practice
              </span>
            </h2>
            
            <div className="space-y-8">
              {benefits.map((benefit, index) => (
                <BenefitItem key={index} {...benefit} index={index} />
              ))}
            </div>
          </div>
          
          <div className="relative">
            {/* Background decoration */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-3xl transform rotate-3 scale-105"></div>
            
            {/* Main image container */}
            <div className="relative bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl shadow-2xl overflow-hidden transform hover:scale-105 transition-transform duration-500">
              <img
                src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="Immigration consultancy team"
                className="w-full h-96 object-cover"
              />
              
              {/* Overlay with stats */}
              <div className="absolute inset-0 bg-gradient-to-t from-blue-900/80 via-transparent to-transparent flex items-end">
                <div className="p-8 text-white">
                  <div className="flex items-center gap-4 mb-4">
                    <Star className="w-5 h-5 text-yellow-400" />
                    <span className="font-semibold">4.9/5 Customer Rating</span>
                  </div>
                  <p className="text-blue-100">
                    "This platform revolutionized our practice efficiency"
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};