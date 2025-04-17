'use client';
import Image from 'next/image';
import {
    EnvironmentOutlined,
    PhoneOutlined,
    MailOutlined,
    ClockCircleOutlined,
} from '@ant-design/icons';
import { useRouter } from 'next/navigation';

export function Footer() {
    return (
        <div className="mt-auto w-full">
            <div className="rounded-lg bg-[#96B79E]/60 p-6 backdrop-blur-sm">
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
            <Image
                src="https://kafi-storage.sgp1.cdn.digitaloceanspaces.com/client/logo.png"
                alt="Kafi Logo"
                width={120}
                height={120}
            />
            <p className="select-none">Coffee Shop</p>
        </div>
    );
}

function Navbar() {
    const router = useRouter();

    const navItems = [
        { path: '/', label: 'Trang chủ' },
        { path: '/menu', label: 'Menu' },
        { path: '/membership', label: 'Chương trình thành viên' },
        { path: '/feedback', label: 'Gửi feedback' },
        { path: '/membership', label: 'Đăng ký thành viên' },
    ];

    return (
        <div className="flex flex-col space-y-5">
            {navItems.map((item) => (
                <a
                    key={item.path + item.label}
                    onClick={() => router.push(item.path)}
                    className="cursor-pointer select-none transition-colors hover:text-green-700"
                >
                    {item.label}
                </a>
            ))}
        </div>
    );
}

function Contact() {
    return (
        <div className="space-y-6">
            <h1 className="select-none font-bold">Liên hệ với chúng tôi</h1>
            <p className="select-none">
                <EnvironmentOutlined /> 222 Nguyễn Văn Cừ, Quận 5
            </p>
            <p className="select-none">
                <PhoneOutlined /> 0912982282
            </p>
            <p className="select-none">
                <MailOutlined /> kaficoffee@gmail.com
            </p>
            <p className="select-none">
                <ClockCircleOutlined /> Thứ 2 - Chủ Nhật / 10:00 AM - 8:00 PM
            </p>
        </div>
    );
}

function Copyright() {
    return (
        <div>
            <p className="mt-6 select-none text-center">© 2025 KafiCoffee</p>
        </div>
    );
}
