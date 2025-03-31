"use client";
import Image from "next/image";
import groupcf from "../../../public/groupcf.png"; 
import logo from "../../../public/logo.png"; 
import bgImage from "../../../public/nen.png"; 

export default function RecoveryPasswordPage() {
  return (
    <div className="relative flex h-screen">
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
    className="object-cover -z-10"
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
  return (
    <div className="w-1/2 flex flex-col justify-center items-center space-y-2">
      <h1 className="text-4xl font-bold mb-6">Khôi Phục Mật Khẩu</h1>
      <p className="text-gray-600 text-center w-4/6 mb-2">
        Nhập mã OTP đã được gửi đến email của bạn
      </p>
      
      <OTPInput />
      <InputField label="Mật khẩu mới" type="password" />
      <InputField label="Xác nhận mật khẩu" type="password" />
      
      <div className="h-2"></div>
      <ResetButton />
    </div>
  );
};

const OTPInput = () => (
  <div className="w-4/6">
    <label className="block font-medium mb-1">Mã OTP</label>
    <div className="flex justify-between gap-2">
      {[...Array(6)].map((_, i) => (
        <input
          key={i}
          type="text"
          maxLength={1}
          className="w-12 h-12 text-center bg-transparent text-black rounded-lg border border-black focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      ))}
    </div>
  </div>
);

const ResetButton = () => (
  <button className="bg-gradient-to-r from-[#1E4522] to-[#3A683D] text-white font-semibold px-6 py-3 rounded-full flex items-center justify-center space-x-2 shadow-md hover:opacity-90 transition">
    Xác Nhận
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 18l6-6-6-6"></path>
    </svg>
  </button>
);

interface InputFieldProps {
  label: string;
  placeholder?: string;
  textarea?: boolean;
  type?: string;
}

const InputField = ({ label, placeholder, textarea, type }: InputFieldProps) => (
  <div className="w-4/6">
    <label className="block font-medium mb-1">{label}</label>
    {textarea ? (
      <textarea
        placeholder={placeholder}
        className="w-full p-3 bg-transparent text-black rounded-full border border-black focus:outline-none placeholder:text-gray-500"
        rows={4}
      ></textarea>
    ) : (
      <input
        type={type}
        placeholder={placeholder}
        className="w-full p-3 bg-transparent text-black rounded-full border border-black focus:outline-none placeholder:text-gray-500"
      />
    )}
  </div>
);
