export function StatusBadge({ status }) {
    const getStatusStyles = (status) => {
      switch (status) {
        case 'Approved':
          return 'bg-green-100 text-green-800';
        case 'In Progress':
          return 'bg-blue-100 text-blue-800';
        case 'Under Review':
          return 'bg-yellow-100 text-yellow-800';
        case 'Pending':
          return 'bg-gray-100 text-gray-800';
        default:
          return 'bg-gray-100 text-gray-800';
      }
    };
    return (
        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusStyles(status)}`}>
          {status}
        </span>
    );
}