import PageMeta from "../../components/common/PageMeta";
import AuthLayout from "./AuthPageLayout";
import SignInForm from "../../components/auth/SignInForm";
import ResetPasswordForm from "../../components/auth/ResetPasswordForm";

export default function ResetPassword() {
  return (
    <>
      <PageMeta
        title="Lupa Password"
        description="Lupa Password"
      />
      <AuthLayout>
        <ResetPasswordForm />
      </AuthLayout>
    </>
  );
}
