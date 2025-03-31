"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import groupcf from "../../../public/groupcf.png"; 
import logo from "../../../public/logo.png"; 
import bgImage from "../../../public/nen.png"; 
import { useAuthStore } from "@/stores/auth-store";

// Steps in the recovery flow
enum RecoveryStep {
  REQUEST_OTP,
  ENTER_OTP,
  RESET_PASSWORD
}

export default function PasswordRecoveryPage() {
  return (
    <div className="relative flex h-screen w-screen overflow-hidden">
      <BackgroundImage />
      <LeftSection />
      <RightSection />
    </div>
  );
}

const BackgroundImage = () => (
  <Image
    src={bgImage}
    alt="Background"
    fill
    className="object-cover w-full h-full fixed inset-0 -z-10"
    priority
  />
);

const LeftSection = () => (
  <div className="w-1/2 flex flex-col justify-center items-center relative">
    <Logo />
    <CoffeeSelectionImage />
  </div>
);

const Logo = () => (
  <div className="absolute top-8 left-36 flex items-center space-x-2">
    <Image src={logo} alt="Kafi Logo" width={400} height={400} />
  </div>
);

const CoffeeSelectionImage = () => (
  <div className="mt-96 -ml-32">
    <Image
      src={groupcf}
      alt="Coffee Selection"
      width={950}
      height={950}
      className="object-cover"
    />
  </div>
);

const RightSection = () => {
  // State for all form fields
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  // State for the recovery flow
  const [currentStep, setCurrentStep] = useState<RecoveryStep>(RecoveryStep.REQUEST_OTP);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(0);
  
  // Password validation state
  const [passwordStrength, setPasswordStrength] = useState({
    length: false,
    hasUppercase: false,
    hasLowercase: false,
    hasNumber: false,
    hasSpecialChar: false
  });
  
  // Get auth functions from store
  const { 
    requestPasswordRecovery, 
    resetPassword,
    isLoading, 
    error: authError, 
    clearError 
  } = useAuthStore();
  
  const router = useRouter();

  // Clear any previous errors when the component mounts
  useEffect(() => {
    clearError();
    return () => {
      // Also clear errors when unmounting
      clearError();
    };
  }, [clearError]);

  // Countdown timer effect
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    
    if (countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prevCountdown) => prevCountdown - 1);
      }, 1000);
    }
    
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [countdown]);

  // Check password strength
  useEffect(() => {
    setPasswordStrength({
      length: newPassword.length >= 8,
      hasUppercase: /[A-Z]/.test(newPassword),
      hasLowercase: /[a-z]/.test(newPassword),
      hasNumber: /[0-9]/.test(newPassword),
      hasSpecialChar: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(newPassword)
    });
  }, [newPassword]);

  // Calculate overall password strength
  const passwordStrengthScore = Object.values(passwordStrength).filter(Boolean).length;
  const isPasswordStrong = passwordStrengthScore >= 4;

  // Handle OTP Request
  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!email) {
      setError("Vui lòng nhập địa chỉ email");
      return;
    }
    
    try {
      await requestPasswordRecovery(email);
      setCurrentStep(RecoveryStep.ENTER_OTP);
      setCountdown(60); // Start 60-second countdown
    } catch {
      setError("Đã xảy ra lỗi khi gửi mã OTP. Vui lòng thử lại sau.");
    }
  };

  // Handle OTP Verification and Move to Reset Password
  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!otp) {
      setError("Vui lòng nhập mã OTP");
      return;
    }
    
    // Move to reset password step
    setCurrentStep(RecoveryStep.RESET_PASSWORD);
  };

  // Handle Password Reset
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!newPassword) {
      setError("Vui lòng nhập mật khẩu mới");
      return;
    }
    
    if (newPassword !== confirmPassword) {
      setError("Mật khẩu không khớp");
      return;
    }
    
    if (!isPasswordStrong) {
      setError("Mật khẩu không đủ mạnh. Vui lòng tuân thủ các yêu cầu về mật khẩu.");
      return;
    }
    
    try {
      await resetPassword(email, otp, newPassword, confirmPassword);
      setSuccess(true);
      
      // Redirect to login page after 3 seconds
      setTimeout(() => {
        clearError(); // Clear errors before redirecting
        router.push("/login");
      }, 3000);
    } catch {
      setError("Đã xảy ra lỗi khi đặt lại mật khẩu. Vui lòng thử lại sau.");
    }
  };

  // Handle OTP Resend
  const handleResendOtp = async () => {
    setError(null);
    try {
      await requestPasswordRecovery(email);
      setOtp("");
      setCountdown(60); // Reset the countdown timer
    } catch {
      setError("Đã xảy ra lỗi khi gửi lại mã OTP");
    }
  };

  // Clear errors when navigating away using the Link component
  const handleNavigation = () => {
    // Clear both local and store errors
    setError(null);
    clearError();
  };

  return (
    <div className="w-1/2 flex flex-col justify-center items-center space-y-4">
      <h1 className="text-4xl font-bold mb-6">
        {currentStep === RecoveryStep.REQUEST_OTP && "Quên Mật Khẩu"}
        {currentStep === RecoveryStep.ENTER_OTP && "Xác Nhận Mã OTP"}
        {currentStep === RecoveryStep.RESET_PASSWORD && "Đặt Lại Mật Khẩu"}
      </h1>
      
      {/* Step indicators */}
      <div className="flex items-center space-x-2 w-4/6 mb-4">
        <div className={`w-1/3 h-2 rounded-full ${currentStep >= RecoveryStep.REQUEST_OTP ? 'bg-green-600' : 'bg-gray-300'}`}></div>
        <div className={`w-1/3 h-2 rounded-full ${currentStep >= RecoveryStep.ENTER_OTP ? 'bg-green-600' : 'bg-gray-300'}`}></div>
        <div className={`w-1/3 h-2 rounded-full ${currentStep >= RecoveryStep.RESET_PASSWORD ? 'bg-green-600' : 'bg-gray-300'}`}></div>
      </div>
      
      <div className="flex justify-between w-4/6 mb-4 text-xs text-gray-600">
        <span>Nhập Email</span>
        <span>Xác Nhận OTP</span>
        <span>Đặt Lại Mật Khẩu</span>
      </div>
      
      {(error || authError) && (
        <div className="w-4/6 text-red-500 text-sm mb-2">
          {error || authError}
        </div>
      )}
      
      {success ? (
        <div className="w-4/6 space-y-4">
          <div className="text-green-600 text-sm mb-2">
            Mật khẩu đã được đặt lại thành công. Bạn sẽ được chuyển đến trang đăng nhập...
          </div>
        </div>
      ) : (
        <>
          {/* Step 1: Request OTP */}
          {currentStep === RecoveryStep.REQUEST_OTP && (
            <form onSubmit={handleRequestOtp} className="w-full flex flex-col items-center space-y-4">
              <div className="w-4/6 text-sm mb-4">
                Nhập địa chỉ email đã đăng ký để nhận mã OTP khôi phục mật khẩu.
              </div>
              
              <InputField 
                label="Email" 
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              
              <button
                type="submit"
                disabled={isLoading}
                className="bg-gradient-to-r from-[#1E4522] to-[#3A683D] text-white font-semibold px-6 py-3 rounded-full flex items-center justify-center space-x-2 shadow-md hover:opacity-90 transition disabled:opacity-50"
              >
                {isLoading ? "Đang gửi..." : "Gửi mã OTP"}
                {!isLoading && (
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 18l6-6-6-6"></path>
                  </svg>
                )}
              </button>
            </form>
          )}
          
          {/* Step 2: Enter OTP */}
          {currentStep === RecoveryStep.ENTER_OTP && (
            <form onSubmit={handleVerifyOtp} className="w-full flex flex-col items-center space-y-4">
              <div className="w-4/6 text-sm mb-4">
                Nhập mã OTP đã được gửi đến email <strong>{email}</strong>
              </div>
              
              <InputField 
                label="Mã OTP" 
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
              
              <button
                type="submit"
                disabled={isLoading}
                className="bg-gradient-to-r from-[#1E4522] to-[#3A683D] text-white font-semibold px-6 py-3 rounded-full flex items-center justify-center space-x-2 shadow-md hover:opacity-90 transition disabled:opacity-50"
              >
                {isLoading ? "Đang xác nhận..." : "Xác nhận mã OTP"}
                {!isLoading && (
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 18l6-6-6-6"></path>
                  </svg>
                )}
              </button>

              <div className="flex space-x-4 mt-4">
                <button
                  type="button"
                  onClick={() => setCurrentStep(RecoveryStep.REQUEST_OTP)}
                  className="text-green-600 font-semibold"
                >
                  Quay lại
                </button>
                
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={isLoading || countdown > 0}
                  className={`text-green-600 font-semibold ${countdown > 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {countdown > 0 
                    ? `Gửi lại mã OTP (${countdown}s)` 
                    : "Gửi lại mã OTP"}
                </button>
              </div>
            </form>
          )}
          
          {/* Step 3: Reset Password */}
          {currentStep === RecoveryStep.RESET_PASSWORD && (
            <form onSubmit={handleResetPassword} className="w-full flex flex-col items-center space-y-4">
              <div className="w-4/6 text-sm mb-4">
                Tạo mật khẩu mới cho tài khoản của bạn.
              </div>
              
              <InputField 
                label="Mật khẩu mới" 
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              
              {/* Password strength indicators */}
              {newPassword.length > 0 && (
                <div className="w-4/6 space-y-2">
                  <div className="flex space-x-1">
                    <div className={`h-1 flex-1 rounded-full ${passwordStrengthScore >= 1 ? 'bg-red-500' : 'bg-gray-200'}`}></div>
                    <div className={`h-1 flex-1 rounded-full ${passwordStrengthScore >= 2 ? 'bg-orange-500' : 'bg-gray-200'}`}></div>
                    <div className={`h-1 flex-1 rounded-full ${passwordStrengthScore >= 3 ? 'bg-yellow-500' : 'bg-gray-200'}`}></div>
                    <div className={`h-1 flex-1 rounded-full ${passwordStrengthScore >= 4 ? 'bg-green-500' : 'bg-gray-200'}`}></div>
                    <div className={`h-1 flex-1 rounded-full ${passwordStrengthScore >= 5 ? 'bg-green-600' : 'bg-gray-200'}`}></div>
                  </div>
                  
                  <div className="text-xs space-y-1">
                    <p className={passwordStrength.length ? 'text-green-600' : 'text-gray-500'}>
                      {passwordStrength.length ? '✓' : '○'} Ít nhất 8 ký tự
                    </p>
                    <p className={passwordStrength.hasUppercase ? 'text-green-600' : 'text-gray-500'}>
                      {passwordStrength.hasUppercase ? '✓' : '○'} Ít nhất 1 chữ hoa
                    </p>
                    <p className={passwordStrength.hasLowercase ? 'text-green-600' : 'text-gray-500'}>
                      {passwordStrength.hasLowercase ? '✓' : '○'} Ít nhất 1 chữ thường
                    </p>
                    <p className={passwordStrength.hasNumber ? 'text-green-600' : 'text-gray-500'}>
                      {passwordStrength.hasNumber ? '✓' : '○'} Ít nhất 1 số
                    </p>
                    <p className={passwordStrength.hasSpecialChar ? 'text-green-600' : 'text-gray-500'}>
                      {passwordStrength.hasSpecialChar ? '✓' : '○'} Ít nhất 1 ký tự đặc biệt
                    </p>
                  </div>
                </div>
              )}
              
              <InputField 
                label="Xác nhận mật khẩu" 
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              
              {confirmPassword && newPassword !== confirmPassword && (
                <div className="w-4/6 text-red-500 text-xs">
                  Mật khẩu không khớp
                </div>
              )}
              
              <button
                type="submit"
                disabled={isLoading || !isPasswordStrong || newPassword !== confirmPassword}
                className="bg-gradient-to-r from-[#1E4522] to-[#3A683D] text-white font-semibold px-6 py-3 rounded-full flex items-center justify-center space-x-2 shadow-md hover:opacity-90 transition disabled:opacity-50"
              >
                {isLoading ? "Đang xử lý..." : "Đặt lại mật khẩu"}
                {!isLoading && (
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 18l6-6-6-6"></path>
                  </svg>
                )}
              </button>
              
              <button
                type="button"
                onClick={() => setCurrentStep(RecoveryStep.ENTER_OTP)}
                className="mt-2 text-green-600 font-semibold"
              >
                Quay lại
              </button>
            </form>
          )}
          
          <BackToLoginLink onNavigate={handleNavigation} />
        </>
      )}
    </div>
  );
};

const BackToLoginLink = ({ onNavigate }: { onNavigate: () => void }) => (
  <p className="mt-6 text-sm">
    <Link href="/login" onClick={onNavigate} className="text-green-600 font-semibold">Quay lại đăng nhập</Link>
  </p>
);

interface InputFieldProps {
  label: string;
  placeholder?: string;
  textarea?: boolean;
  type?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const InputField = ({ label, placeholder, textarea, type, value, onChange }: InputFieldProps) => {
  const [showPassword, setShowPassword] = useState(false);
  
  const isPasswordField = type === 'password';
  const actualType = isPasswordField ? (showPassword ? 'text' : 'password') : type;
  
  return (
    <div className="w-4/6">
      <label className="block font-medium mb-1">{label}</label>
      <div className="relative">
        {textarea ? (
          <textarea
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            className="w-full p-3 bg-transparent text-black rounded-full border border-black focus:outline-none placeholder:text-gray-500"
            rows={4}
          ></textarea>
        ) : (
          <>
            <input
              type={actualType}
              placeholder={placeholder}
              value={value}
              onChange={onChange}
              className="w-full p-3 bg-transparent text-black rounded-full border border-black focus:outline-none placeholder:text-gray-500 pr-10"
            />
            {isPasswordField && (
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? (
                  // Eye crossed icon (hide password)
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" />
                    <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                  </svg>
                ) : (
                  // Eye icon (show password)
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                    <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                  </svg>
                )}
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}; 