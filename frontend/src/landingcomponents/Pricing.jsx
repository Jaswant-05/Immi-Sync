import { PriceCard } from "../components/PriceCard";


export const Pricing = () =>{
    return (
        <div className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-1.5 bg-blue-100 rounded-full mb-4">
              <span className="text-sm text-blue-600 font-medium">Pricing</span>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Simple, Transparent Pricing</h2>
            <p className="text-lg text-gray-600">Choose the perfect plan for your practice</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <PriceCard
              title="Starter"
              price="$99"
              description="Perfect for small practices"
              features={[
                "Up to 50 active clients",
                "Basic document management",
                "Email support",
                "Client portal access"
              ]}
              buttonText="Start Free Trial"
              highlighted={false}
            />
            <PriceCard
              title="Professional"
              price="$199"
              description="Most popular for growing firms"
              features={[
                "Up to 200 active clients",
                "Advanced document management",
                "Priority support",
                "Custom branding",
                "API access"
              ]}
              buttonText="Get Started"
              highlighted={true}
            />
            <PriceCard
              title="Enterprise"
              price="Custom"
              description="For large organizations"
              features={[
                "Unlimited active clients",
                "Advanced security features",
                "24/7 dedicated support",
                "Custom integrations",
                "Training & onboarding"
              ]}
              buttonText="Contact Sales"
              highlighted={false}
            />
          </div>
        </div>
      </div>
    )
};