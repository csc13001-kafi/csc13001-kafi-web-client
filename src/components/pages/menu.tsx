'use client';
import { twMerge } from 'tailwind-merge';
import Image from 'next/image';
import iceBlend from '@/public/menu/icons/ice-blend.png';
import tea from '@/public/menu/icons/tea.png';
import matcha from '@/public/menu/icons/matcha.png';
import coffee from '@/public/menu/icons/coffee.png';
import cake from '@/public/menu/icons/cake.png';

import coffeeDenDa from '@/public/menu/images/coffee-den-da.png';
import bacXiuNong from '@/public/menu/images/bac-xiu-nong.png';
import coffeeSuaDa from '@/public/menu/images/caphe-sua-da.png';
import latteNong from '@/public/menu/images/latte-nong.png';
import caramelMachiato from '@/public/menu/images/caramel-machiato.png';
import coffeeDenNong from '@/public/menu/images/coffee-den-nong.png';
import bacXiuDa from '@/public/menu/images/bac-xiu-da.png';
import caramelMachiatoDa from '@/public/menu/images/caramel-machiato-da.png';
import latteDa from '@/public/menu/images/latte-da.png';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';

const categories = [
    { name: 'Đá Xay', icons: iceBlend },
    { name: 'Trà', icons: tea },
    { name: 'Matcha', icons: matcha },
    { name: 'Cà Phê', icons: coffee },
    { name: 'Bánh Ngọt', icons: cake },
];

const menuItems = [
    { name: 'Cà phê đen đá', price: '40.000', images: coffeeDenDa },
    { name: 'Bạc xỉu nóng', price: '40.000', images: bacXiuNong },
    { name: 'Cà phê sữa đá', price: '40.000', images: coffeeSuaDa },
    { name: 'Latte nóng', price: '40.000', images: latteNong },
    { name: 'Caramel Machiato nóng', price: '40.000', images: caramelMachiato },
    { name: 'Cà phê đen nóng', price: '40.000', images: coffeeDenNong },
    { name: 'Bạc xỉu đá', price: '40.000', images: bacXiuDa },
    { name: 'Caramel Machiato đá', price: '40.000', images: caramelMachiatoDa },
    { name: 'Latte đá', price: '40.000', images: latteDa },
];

const Intro = () => (
    <div className="select-none space-y-6">
        <Title title="Menu Kafi – Hương vị dành cho bạn! ☕🍰" />
        <Description description="Từ cà phê đậm đà, trà thanh mát đến bánh ngọt hấp dẫn, mỗi món trong menu Kafi đều được chọn lọc để mang đến trải nghiệm tuyệt vời nhất. Hôm nay bạn chọn gì? 😍📖" />
    </div>
);

const Title = ({ className, title }: { className?: string; title: string }) => (
    <h2 className={twMerge('text-center text-5xl font-bold', className)}>
        {title}
    </h2>
);

const Description = ({
    className,
    description,
}: {
    className?: string;
    description: string;
}) => <p className={twMerge('text-center', className)}>{description}</p>;

function Category() {
    return (
        <div className="flex justify-center">
            <div className="grid grid-cols-5 gap-20">
                {categories.map((category) => (
                    <div
                        key={category.name}
                        className={`flex h-56 w-40 flex-col items-center justify-center rounded-3xl ${
                            category.name === 'Cà Phê'
                                ? 'bg-green-900 text-white'
                                : 'bg-[#A4BBAA]'
                        }`}
                    >
                        <Image
                            src={category.icons}
                            alt={category.name}
                            width={category.name === 'Đá Xay' ? 96 : 128}
                            height={category.name === 'Đá Xay' ? 96 : 128}
                            className="object-contain"
                        />
                        <p className="mt-2 text-lg font-medium">
                            {category.name}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}

function MenuList() {
    return (
        <div className="grid grid-cols-6 gap-6">
            {menuItems.map((item) => (
                <div
                    key={item.name}
                    className="flex h-[250px] flex-col items-center justify-between rounded-2xl bg-white p-4 shadow-md"
                >
                    <div className="flex h-[120px] w-[120px] items-center justify-center">
                        <Image
                            src={item.images}
                            alt={item.name}
                            width={120}
                            height={120}
                            className="rounded-xl object-cover"
                        />
                    </div>
                    <p className="text-center text-lg font-semibold">
                        {item.name}
                    </p>
                    <p className="text-center text-sm font-medium text-gray-500">
                        {item.price.toLocaleString()} đ
                    </p>
                </div>
            ))}
        </div>
    );
}

export default function Menu() {
    return (
        <div className="flex min-h-screen flex-col bg-gray-100">
            <Header />
            <div className="flex-1 p-8">
                <div className="relative space-y-20">
                    <div className="mx-28 justify-center space-y-20">
                        <Intro />
                        <Category />
                        <div className="mb-4 w-[1350px] border-b-[3px] border-black"></div>
                        <MenuList />
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}
