import React, { useState, useRef, useEffect } from "react";
import clsx from "clsx";
import { ChevronDown } from "lucide-react";

const VARIANTS = {
  primary: "",
  default: `focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500`,
  error: `focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500`,
};

export const Select = ({ label, options = [], variant = "default", register, setValue, required, name, className }) => {
  const [selected, setSelected] = useState(options[0]?.value || "");
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleOpen = () => setIsOpen(prev => !prev);
  const close = () => setIsOpen(false);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        close();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (value) => {
    setSelected(value);
    setValue(name, value); 
    close();
  };

  return (
    <>
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      <div className="relative" ref={dropdownRef}>
        <div
          onClick={toggleOpen}
          className={clsx(
            `block w-full pl-4 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg cursor-pointer
            text-gray-900 transition-all duration-200 flex justify-between`,
            VARIANTS[variant],
            className
          )}
        >
          {options.find(opt => opt.value === selected)?.label || "Select..."}
          <ChevronDown />
        </div>
        {isOpen && (
          <ul className="absolute z-10 mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto">
            {options.map(({ value, label }) => (
              <li
                key={value}
                onClick={() => handleSelect(value)}
                className="px-4 py-2 hover:bg-blue-100 cursor-pointer"
              >
                {label}
              </li>
            ))}
          </ul>
        )}
        <input
          type="hidden"
          value={selected}
          {...register(name || label, { required })}
        />
      </div>
    </>
  );
};
