'use client';
import Image from 'next/image';
import { twMerge } from 'tailwind-merge';
import card from '../../../public/home-page/card 6.png';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { useEffect, useState } from 'react';
import { useAuthStore } from '@/stores/auth-store';
import api from '@/lib/api';

export default function Membership() {
    return (
        <div className="flex min-h-screen flex-col bg-gray-100">
            <Header />
            <div className="flex-1 p-8">
                <div className="relative mx-28 space-y-20">
                    <Intro />
                    <MyMembership />
                </div>
            </div>
            <Footer />
        </div>
    );
}

const Intro = () => (
    <div className="select-none space-y-6">
        <Title title="Thành viên Kafi – Đặc quyền dành riêng cho bạn! 🎉☕" />
        <Description description="Tích điểm, nhận ưu đãi, tận hưởng những đặc quyền chỉ dành cho thành viên. Đăng ký ngay để không bỏ lỡ những điều đặc biệt từ Kafi! 💳✨" />
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

const MemberCard = ({
    className,
    name,
    phone,
    point,
    loyalty,
}: {
    className?: string;
    name: string;
    phone: string;
    point: string;
    loyalty: string;
}) => (
    <div className={twMerge('relative text-2xl text-white', className)}>
        <div className="relative w-full">
            <Image className="-z-10 w-full" src={card} alt="card" />
            <div className="absolute bottom-0 left-0 right-0 top-0 flex p-12">
                <div className="flex flex-[1] flex-col justify-end">
                    <p className="font-bold">{name}</p>
                    <p className="font-bold">{phone}</p>
                </div>
                <div className="flex-[1]">
                    <p className="text-end">{loyalty}</p>
                    <p className="text-end font-bold">{point}</p>
                </div>
            </div>
        </div>
    </div>
);

const MyMembership = () => {
    const [userData, setUserData] = useState({
        name: '',
        phone: '',
        point: '0',
        loyalty: 'Đồng',
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { token } = useAuthStore();

    const evaluateLoyalty = (point: number): string => {
        if (point >= 5000) {
            return 'Kim Cương';
        } else if (point >= 2000) {
            return 'Vàng';
        } else if (point >= 1000) {
            return 'Bạc';
        }
        return 'Đồng';
    };

    useEffect(() => {
        const fetchUserData = async () => {
            if (!token) {
                setError('Bạn cần đăng nhập để xem thông tin thành viên');
                setLoading(false);
                return;
            }

            try {
                setLoading(true);

                const response = await api.get(`/users/user`);
                const data = response.data;
                console.log(data);
                setUserData({
                    name: data.username || 'Chưa có thông tin',
                    phone: data.phone || 'Chưa có thông tin',
                    point: data.loyaltyPoints?.toString() || '0',
                    loyalty: evaluateLoyalty(data.loyaltyPoints) || 'Đồng',
                });
            } catch (err) {
                console.error('Error fetching user data:', err);
                setError('Không thể tải thông tin người dùng');
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [token]);

    return (
        <div className="mt-6 grid select-none grid-cols-9 gap-10">
            <div className="col-span-4 space-y-8 border-r-2 border-black pr-8">
                <h2 className="text-2xl font-semibold">Thành viên của bạn</h2>
                {loading ? (
                    <div className="py-8 text-center">
                        Đang tải thông tin...
                    </div>
                ) : error ? (
                    <div className="py-8 text-center text-red-500">{error}</div>
                ) : (
                    <>
                        <MemberCard
                            name={userData.name}
                            phone={userData.phone}
                            point={userData.point}
                            loyalty={userData.loyalty}
                        />
                        <MembershipProgress loyalty={userData.loyalty} />
                    </>
                )}
            </div>
            <div className="col-span-5 space-y-8">
                <h2 className="mb-4 text-2xl font-semibold">
                    Chương trình thành viên của Kafi
                </h2>
                <MembershipTable />
                <PointConversion />
            </div>
        </div>
    );
};

const MembershipProgress = ({ loyalty = 'Đồng' }) => {
    const getProgressWidth = () => {
        switch (loyalty) {
            case 'Đồng':
                return 'w-1/4';
            case 'Bạc':
                return 'w-2/4';
            case 'Vàng':
                return 'w-3/4';
            case 'Kim Cương':
                return 'w-full';
            default:
                return 'w-1/4';
        }
    };

    return (
        <div className="mt-6">
            <div className="flex items-center justify-between text-sm">
                <span>Đồng</span> <span>Bạc</span> <span>Vàng</span>{' '}
                <span>Kim Cương</span>
            </div>
            <div className="mt-2 h-1 w-full rounded-full bg-gray-300">
                <div
                    className={`h-1 rounded-full bg-yellow-500 ${getProgressWidth()}`}
                ></div>
            </div>
        </div>
    );
};

const MembershipTable = () => (
    <table className="w-full border-collapse overflow-hidden rounded-2xl border border-[#B1D4E0] bg-[#F9F9F9] text-lg">
        <thead>
            <tr className="h-16 bg-green-100 text-xl">
                <th className="border p-4">Hạng mức</th>
                <th className="border p-4">Điểm tích lũy</th>
                <th className="border p-4">Quyền lợi</th>
            </tr>
        </thead>
        <tbody className="text-center">
            <tr className="h-16">
                <td className="border p-4">Đồng</td>
                <td className="border p-4">Từ hóa đơn đầu tiên</td>
                <td className="border p-4">Không có</td>
            </tr>
            <tr className="h-16">
                <td className="border p-4">Bạc</td>
                <td className="border p-4">Từ 1000 điểm</td>
                <td className="border p-4">Giảm 5% hóa đơn</td>
            </tr>
            <tr className="h-16">
                <td className="border p-4">Vàng</td>
                <td className="border p-4">Từ 2000 điểm</td>
                <td className="border p-4">Giảm 10% hóa đơn</td>
            </tr>
            <tr className="h-16">
                <td className="border p-4">Kim Cương</td>
                <td className="border p-4">Từ 5000 điểm</td>
                <td className="border p-4">Giảm 15% hóa đơn</td>
            </tr>
        </tbody>
    </table>
);

const PointConversion = () => (
    <div className="mt-6 text-left">
        <h2 className="text-lg font-semibold">Quy tắc đổi điểm</h2>
        <p className="text-xl font-bold text-[#458353]">1.000 VND = 1 điểm</p>
    </div>
);
