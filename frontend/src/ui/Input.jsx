import clsx from "clsx";

const VARIANTS = {
    primary : "",
    default : `focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500`,
    error : `focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500`
}

export const Input = ({type, name, variant = "default", label, register, className, required}) => {
 return (   
    <>
        <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
        <input 
            className={clsx(
                `block w-full pl-4 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg
                text-gray-900 placeholder-gray-400 transition-all duration-200`,
                VARIANTS[variant],
                className
            )}
            type={type}
            placeholder={label}
            {...register(name, { required })} 
        />
     </>
 )
};