import "./../FormSignStylee.css";
import { useState } from "react";
import SignUpForm from "../Steps/SignUpForm";
import VerifyForm from "../Steps/VerifyForm";
import ForgotPasswordForm from "./../Steps/ForgotPassowrdForm";
import VerifyPasswordCode from "../Steps/VerifyPasswordCode";
import NewPasswordForm from "../Steps/NewPasswordForm";
import LogIn from "../Steps/LogIn";

export const STEPS = {
  SIGN_UP: "signUp",
  LOG_IN: "login",
  VERIFY: "verify-code",
  FORGOT_PASSWORD: "forget-password",
  VERIFY_OTP: "verify-otp",
  NEW_PASSWORD: "newPassword",
};

export default function FormSign() {
  const [step, setStep] = useState(STEPS.SIGN_UP);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
    number: "",
    date: "",
    role: "visitor",
    code: "",
    otp_code: "",
    newPassword: "",
  });

  const updateField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="login-container min-vh-100">
      {/* دوائر متوازنة في الخلفية */}
      <div className="decor-element circle-1"></div>
      <div className="decor-element circle-2"></div>
      <div className="decor-element circle-3"></div>
      
      {/* العناصر الإضافية للخطوط المتحركة حول الفورم */}
      <div className="border-animation border-animation-top"></div>
      <div className="border-animation border-animation-right"></div>
      <div className="border-animation border-animation-bottom"></div>
      <div className="border-animation border-animation-left"></div>
      
      {step === STEPS.SIGN_UP && (
        <SignUpForm
          formData={formData}
          updateField={updateField}
          setStep={setStep}
        />
      )}
      
      {step === STEPS.LOG_IN && (
        <LogIn setStep={setStep} />
      )}

      {step === STEPS.VERIFY && (
        <VerifyForm
          code={formData.code}
          setCode={(val) => updateField("code", val)}
          setStep={setStep}
        />
      )}

      {step === STEPS.FORGOT_PASSWORD && (
        <ForgotPasswordForm
          email={formData.email}
          setEmail={(val) => updateField("email", val)}
          setStep={setStep}
        />
      )}

      {step === STEPS.VERIFY_OTP && (
        <VerifyPasswordCode
          otp_code={formData.otp_code}
          email={formData.email}
          setCode={(val) => updateField("otp_code", val)}
          setStep={setStep}
        />
      )}

      {step === STEPS.NEW_PASSWORD && (
        <NewPasswordForm code={formData.otp_code} setStep={setStep} />
      )}
    </div>
  );
}