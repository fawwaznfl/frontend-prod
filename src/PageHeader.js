import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const PageHeader = ({ pageTitle, titleClass = "text-2xl", rightContent }) => {
    return (_jsxs("div", { className: "flex items-center justify-between bg-white dark:bg-gray-900 p-5 rounded-xl shadow-sm mb-6", children: [_jsx("h2", { className: `${titleClass} font-semibold text-gray-800 dark:text-white`, children: pageTitle }), _jsx("div", { className: "flex items-center gap-3", children: rightContent })] }));
};
export default PageHeader;
