import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useRef } from "react";
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.css";
import Label from "./Label";
import { CalenderIcon } from "../../icons";
export default function DatePicker({ id, mode = "single", onChange, label, defaultDate, selected, placeholder, }) {
    const inputRef = useRef(null);
    const fpInstance = useRef(null);
    useEffect(() => {
        if (!inputRef.current)
            return;
        // Destroy Flatpickr sebelumnya jika ada
        fpInstance.current?.destroy();
        fpInstance.current = flatpickr(inputRef.current, {
            mode,
            static: true,
            monthSelectorType: "static",
            dateFormat: "Y-m-d",
            defaultDate: selected ?? defaultDate ?? undefined,
            onChange: (_, dateStr) => {
                onChange?.(dateStr);
            },
        });
        return () => {
            fpInstance.current?.destroy();
            fpInstance.current = null;
        };
    }, [mode, onChange, selected, defaultDate]);
    return (_jsxs("div", { children: [label && _jsx(Label, { htmlFor: id, children: label }), _jsxs("div", { className: "relative", children: [_jsx("input", { ref: inputRef, id: id, placeholder: placeholder, className: "h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs \n            placeholder:text-gray-400 focus:outline-hidden focus:ring-3 \n            dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 \n            bg-transparent text-gray-800 border-gray-300 \n            focus:border-brand-300 focus:ring-brand-500/20 \n            dark:border-gray-700 dark:focus:border-brand-800", readOnly: true }), _jsx("span", { className: "absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400", children: _jsx(CalenderIcon, { className: "size-6" }) })] })] }));
}
