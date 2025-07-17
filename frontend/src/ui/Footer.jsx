import { ArrowRight } from "lucide-react"
import { Button } from "./Button";

export const Footer = () => {
  return (
    <section className="relative py-32 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 overflow-hidden">
    
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-8 leading-tight">
          Ready to Transform Your{" "}
          <span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
            Immigration Practice?
          </span>
        </h2>
        
        <p className="text-xl text-blue-200 mb-12 max-w-3xl mx-auto leading-relaxed">
          Join hundreds of immigration consultancies already using our platform 
          to deliver exceptional client experiences and grow their business.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
          <Button variant="primary" className="text-lg px-8 py-4 min-w-48">
            Start Free Trial <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
          <Button variant="outline" className="text-lg px-8 py-4 min-w-48">
            Schedule Demo
          </Button>
        </div>
        
        {/* Trust indicators */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto text-blue-200">
          <div className="text-center">
            <div className="text-2xl font-bold text-white mb-2">SOC 2</div>
            <div className="text-sm">Compliant</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-white mb-2">GDPR</div>
            <div className="text-sm">Ready</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-white mb-2">256-bit</div>
            <div className="text-sm">Encryption</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-white mb-2">24/7</div>
            <div className="text-sm">Support</div>
          </div>
        </div>
      </div>
    </section>
  );
};
