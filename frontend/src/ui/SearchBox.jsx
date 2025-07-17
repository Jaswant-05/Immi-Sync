export const SearchBox = ({ placeholder }) => {
  return (
    <div className="w-full">
      <input 
        type="text" 
        placeholder={placeholder}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
      />
    </div>
  );
};