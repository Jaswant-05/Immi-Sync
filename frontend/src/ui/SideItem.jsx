export const SideItem = ({ icon, text, active = false, expanded = true, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center px-4 py-3 ${
        active ? 'bg-indigo-800 border-r-4 border-indigo-400' : 'hover:bg-indigo-600'
      } transition-colors duration-200`}
    >
      <span className="p-2">{icon}</span>
      {expanded && <span className="ml-3">{text}</span>}
    </button>
  );
};