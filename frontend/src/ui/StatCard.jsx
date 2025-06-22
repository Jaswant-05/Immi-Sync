export function StatCard({ icon, title, value, trend }) {
    const trendColor = trend.startsWith('+') ? 'text-green-500' : 'text-red-500';
    
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="p-2 bg-gray-50 rounded-lg">{icon}</div>
          <span className={`text-sm font-semibold ${trendColor}`}>{trend}</span>
        </div>
        <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
        <p className="text-2xl font-bold text-gray-900 mt-2">{value.toLocaleString()}</p>
      </div>
    );
  }