import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import PageMeta from "../../components/common/PageMeta";
import AuthLayout from "./AuthPageLayout";
import ForgotPasswordForm from "../../components/auth/ForgotPasswordForm";
export default function ForgotPassword() {
    return (_jsxs(_Fragment, { children: [_jsx(PageMeta, { title: "Lupa Password", description: "Lupa Password" }), _jsx(AuthLayout, { children: _jsx(ForgotPasswordForm, {}) })] }));
}
