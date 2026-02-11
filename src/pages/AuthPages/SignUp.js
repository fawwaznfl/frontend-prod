import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import PageMeta from "../../components/common/PageMeta";
import AuthLayout from "./AuthPageLayout";
import SignUpForm from "../../components/auth/SignUpForm";
export default function SignUp() {
    return (_jsxs(_Fragment, { children: [_jsx(PageMeta, { title: "Daftar", description: "Daftar" }), _jsx(AuthLayout, { children: _jsx(SignUpForm, {}) })] }));
}
