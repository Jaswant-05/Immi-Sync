import { PriceCard } from "./PriceCard";

export const Pricing = () => {
  const plans = [
    {
      title: "Starter",
      price: "$99",
      description: "Perfect for small practices",
      features: [
        "Up to 50 active clients",
        "Basic document management",
        "Email support",
        "Client portal access",
        "Basic reporting"
      ],
      buttonText: "Start Free Trial",
      highlighted: false
    },
    {
      title: "Professional",
      price: "$199",
      description: "Most popular for growing firms",
      features: [
        "Up to 200 active clients",
        "Advanced document management",
        "Priority support",
        "Custom branding",
        "API access",
        "Advanced analytics"
      ],
      buttonText: "Get Started",
      highlighted: true
    },
    {
      title: "Enterprise",
      price: "Custom",
      description: "For large organizations",
      features: [
        "Unlimited active clients",
        "Advanced security features",
        "24/7 dedicated support",
        "Custom integrations",
        "Training & onboarding",
        "White-label solution"
      ],
      buttonText: "Contact Sales",
      highlighted: false
    }
  ];

  return (
    <section className="py-32 bg-gradient-to-b from-slate-900 to-slate-800 relative overflow-hidden">

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDU5LDEzMCwyNDYsMC4xKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-20"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-20">
          <div className="inline-flex items-center px-6 py-2 rounded-full bg-blue-500/10 border border-blue-400/20 backdrop-blur-sm mb-6">
            <span className="text-blue-300 font-medium">Pricing</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Simple,{" "}
            <span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
              Transparent Pricing
            </span>
          </h2>
          
          <p className="text-xl text-blue-200 max-w-2xl mx-auto">
            Choose the perfect plan for your practice. All plans include a 14-day free trial.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <PriceCard key={index} {...plan} index={index} />
          ))}
        </div>
        
        {/* Additional info */}
        <div className="text-center mt-16">
          <p className="text-blue-200 mb-4">All plans include SSL encryption, data backups, and GDPR compliance</p>
          <div className="flex justify-center items-center gap-8 text-sm text-blue-300">
            <span>✓ 14-day free trial</span>
            <span>✓ No setup fees</span>
            <span>✓ Cancel anytime</span>
          </div>
        </div>
      </div>
    </section>
  );
};