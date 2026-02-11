import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import PageMeta from "../../components/common/PageMeta";
import AuthLayout from "./AuthPageLayout";
import SignInForm from "../../components/auth/SignInForm";
export default function SignIn() {
    return (_jsxs(_Fragment, { children: [_jsx(PageMeta, { title: "Masuk", description: "Masuk" }), _jsx(AuthLayout, { children: _jsx(SignInForm, {}) })] }));
}
