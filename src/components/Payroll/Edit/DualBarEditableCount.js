import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
export default function DualBarEditableCount({ title, count, onCountChange, countSuffix, amount, onAmountChange, amountLabel, }) {
    const [countDisplay, setCountDisplay] = useState("");
    const [amountDisplay, setAmountDisplay] = useState("");
    // sync COUNT
    useEffect(() => {
        setCountDisplay(count > 0 ? String(count) : "");
    }, [count]);
    // sync AMOUNT (rupiah, tanpa .00)
    useEffect(() => {
        setAmountDisplay(amount > 0 ? Math.floor(amount).toLocaleString("id-ID") : "");
    }, [amount]);
    return (_jsxs("div", { className: "flex flex-col space-y-3", children: [_jsx("span", { className: "text-sm font-medium text-gray-700", children: title }), _jsxs("div", { className: "flex overflow-hidden rounded-xl border bg-gray-100", children: [_jsx("input", { type: "text", inputMode: "numeric", placeholder: "0", value: countDisplay, onChange: (e) => {
                            const raw = e.target.value.replace(/\D/g, "");
                            setCountDisplay(raw);
                            onCountChange(raw === "" ? 0 : Number(raw));
                        }, className: "flex-1 bg-orange-400 px-4 py-2 text-black outline-none" }), _jsx("div", { className: "bg-gray-200 px-4 py-2 text-gray-700 whitespace-nowrap", children: countSuffix })] }), _jsxs("div", { className: "flex overflow-hidden rounded-xl border bg-gray-100", children: [_jsx("input", { type: "text", inputMode: "numeric", placeholder: "0", value: amountDisplay, onChange: (e) => {
                            const raw = e.target.value.replace(/\D/g, "");
                            const num = raw === "" ? 0 : Number(raw);
                            setAmountDisplay(raw ? num.toLocaleString("id-ID") : "");
                            onAmountChange(num);
                        }, className: "flex-1 bg-white px-4 py-2 text-black outline-none" }), _jsx("div", { className: "bg-gray-200 px-4 py-2 text-gray-700 whitespace-nowrap", children: amountLabel })] })] }));
}
