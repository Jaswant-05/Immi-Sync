export function BenefitItem({ icon, title, description }) {
    return (
      <div className="flex gap-4 group">
        <div className="flex-shrink-0 transform group-hover:scale-110 transition-transform duration-300">{icon}</div>
        <div>
          <h3 className="font-semibold text-gray-900 mb-1">{title}</h3>
          <p className="text-gray-600">{description}</p>
        </div>
      </div>
    );
  }