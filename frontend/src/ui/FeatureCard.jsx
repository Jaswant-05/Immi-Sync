export const FeatureCard = ({ title, description, icon: Icon }) => {
    return (
      <div className="group bg-white p-8 rounded-xl shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
        <div className="mb-4 transform group-hover:scale-110 transition-transform duration-300">
          <Icon className="w-8 h-8 text-blue-600" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600">{description}</p>
      </div>
    );
  };
  