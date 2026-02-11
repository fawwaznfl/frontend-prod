import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
const Select = ({ name = "", options, placeholder = "Select an option", value = "", onChange, className = "", defaultValue = "", }) => {
    const [selectedValue, setSelectedValue] = useState(defaultValue);
    useEffect(() => {
        setSelectedValue(value ?? "");
    }, [value]);
    const handleChange = (e) => {
        const val = e.target.value;
        setSelectedValue(val);
        onChange(name, val); // ⬅️ kirim name + value
    };
    return (_jsxs("select", { name: name, className: `h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 pr-11 text-sm shadow-theme-xs placeholder:text-gray-400 ${className}`, value: selectedValue, onChange: handleChange, children: [_jsx("option", { value: "", className: "text-gray-700 dark:text-gray-400", children: placeholder }), options.map((option) => (_jsx("option", { value: option.value, children: option.label }, option.value)))] }));
};
export default Select;
