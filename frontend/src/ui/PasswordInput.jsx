import { Eye, EyeOff } from "lucide-react";

export const PasswordInput = ({ name, label, placeholder, value, onChange, showPassword, onToggleVisibility, error }) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
        <div className="relative">
            <input
                type={showPassword ? 'text' : 'password'}
                id={name}
                name={name}
                value={value}
                onChange={onChange}
                className={`w-full px-3 py-2 pr-10 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                    error ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder={placeholder}
            />
            <button
                type="button"
                onClick={onToggleVisibility}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
                {showPassword ? <EyeOff size={16} className="text-gray-400" /> : <Eye size={16} className="text-gray-400" />}
            </button>
        </div>
        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
);