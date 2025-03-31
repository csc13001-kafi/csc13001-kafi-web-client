'use client'
import React from 'react';


export default function EditProfile() {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="max-w-screen-lg w-2/4 rounded-2xl p-10 space-y-16">
          <h1 className="text-5xl font-bold text-center mb-8">Chỉnh sửa thông tin</h1>
  
          <div className="bg-white p-6 rounded-2xl shadow border-2 border-[#E4E4E4]">
            <h2 className="text-2xl font-semibold mb-4">Thông tin cơ bản</h2>
            <div className="space-y-4">
              <InputField label="Họ và Tên" placeholder="Nhập họ tên" />
              <InputField label="Email" placeholder="Nhập email" />
              <InputField label="Số điện thoại" placeholder="Nhập số điện thoại" />
            </div>
          </div>
  
          <div className="bg-white p-6 rounded-2xl shadow border-2 border-[#E4E4E4] mt-6">
            <h2 className="text-2xl font-semibold mb-4">Cài đặt mật khẩu</h2>
            <div className="space-y-4">
              <InputField label="Mật khẩu cũ" placeholder="Nhập mật khẩu cũ" type="password" />
              <InputField label="Mật khẩu mới" placeholder="Nhập mật khẩu mới" type="password" />
              <InputField label="Nhập lại mật khẩu mới" placeholder="Nhập lại mật khẩu mới" type="password" />
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  interface InputFieldProps {
    label: string;
    placeholder: string;
    type?: string;
  }

  function InputField({ label, placeholder, type = "text" }: InputFieldProps) {
    return (
      <div>
        <label className="block font-medium mb-1">{label}</label>
        <input
          type={type}
          placeholder={placeholder}
          className="w-full p-3 bg-[#A4BBAA] text-white rounded-2xl focus:outline-none placeholder:text-black"
        />
      </div>
    );
  }
  