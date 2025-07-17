export function BenefitItem({ icon, title, description, index }) {
  return (
    <div 
      className="flex gap-6 group animate-fade-in"
      style={{ animationDelay: `${index * 200}ms` }}
    >
      <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
        {icon}
      </div>
      <div>
        <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-blue-200 transition-colors">
          {title}
        </h3>
        <p className="text-blue-200/80 leading-relaxed">{description}</p>
      </div>
    </div>
  );
}