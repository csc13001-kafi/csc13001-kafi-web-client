"use client";
import Image from "next/image";
import logo from "../../../public/logo.png";
import { EnvironmentOutlined, PhoneOutlined, MailOutlined, ClockCircleOutlined } from '@ant-design/icons';

export function Footer() {
  return (
    <div className="w-full mt-auto">
      <div className="bg-[#96B79E]/60 backdrop-blur-sm rounded-lg p-6">
        <Info />
        <Copyright />
      </div>
    </div>
  );
}

function Info() {
  return (
    <div className="flex justify-between gap-9">
      <Kafi />
      <Navbar />
      <Contact />
    </div>
  );
}

function Kafi() {
  return (
    <div className="flex flex-col">
      <Image src={logo} alt="Kafi Logo" width={120} height={120} />
      <p className="select-none">Coffee Shop</p>
    </div>
  );
}

function Navbar() {
  return (
    <div className="flex flex-col space-y-6">
      <a className="select-none">Menu</a>
      <a className="select-none">Chương trình thành viên</a>
    </div>
  );
}

function Contact() {
  return (
    <div className="space-y-6">
      <h1 className="font-bold select-none">Liên hệ với chúng tôi</h1>
      <p className="select-none"><EnvironmentOutlined /> 222 Nguyễn Văn Cừ, Quận 5</p>
      <p className="select-none"><PhoneOutlined /> 0912982282</p>
      <p className="select-none"><MailOutlined /> kaficoffee@gmail.com</p>
      <p className="select-none"><ClockCircleOutlined /> Thứ 2 - Chủ Nhật / 10:00 AM - 8:00 PM</p>
    </div>
  );
}

function Copyright() {
  return (
    <div>
      <p className="text-center mt-6 select-none">
        © 2025 KafiCoffee
      </p>
    </div>
  );
} 