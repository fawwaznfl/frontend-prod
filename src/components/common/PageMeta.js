import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { HelmetProvider, Helmet } from "react-helmet-async";
const PageMeta = ({ title, description, }) => (_jsxs(Helmet, { children: [_jsx("title", { children: title }), _jsx("meta", { name: "description", content: description })] }));
export const AppWrapper = ({ children }) => (_jsx(HelmetProvider, { children: children }));
export default PageMeta;
