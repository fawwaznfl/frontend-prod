import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import PageMeta from "../../components/common/PageMeta";
import AuthLayout from "./AuthPageLayout";
import ResetPasswordForm from "../../components/auth/ResetPasswordForm";
export default function ResetPassword() {
    return (_jsxs(_Fragment, { children: [_jsx(PageMeta, { title: "Lupa Password", description: "Lupa Password" }), _jsx(AuthLayout, { children: _jsx(ResetPasswordForm, {}) })] }));
}
