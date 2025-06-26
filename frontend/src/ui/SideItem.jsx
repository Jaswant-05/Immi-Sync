export function SideItem({ icon, text, active = false, expanded = true }) {
    return (
      <a
        href="#"
        className={`flex items-center px-4 py-3 ${
          active ? 'bg-indigo-800' : 'hover:bg-indigo-600'
        } transition-colors duration-200`}
      >
        <span className="p-2">{icon}</span>
        {expanded && <span className="ml-3">{text}</span>}
      </a>
    );
  }