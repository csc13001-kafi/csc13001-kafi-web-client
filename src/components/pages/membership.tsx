'use client'
import Image from "next/image";
import { twMerge } from "tailwind-merge";
import card from "../../../public/card 6.png";

export default function Membership() {
    return (
        <div className="bg-gray-100 p-8 min-h-screen">
            <div className="mx-28 space-y-20 relative">
                <Intro />
                <MyMembership />
            </div>
        </div>
    );
}

const Intro = () => (
    <div className="space-y-6">
        <Title title="Thành viên Kafi – Đặc quyền dành riêng cho bạn! 🎉☕" />
        <Description description="Tích điểm, nhận ưu đãi, tận hưởng những đặc quyền chỉ dành cho thành viên. Đăng ký ngay để không bỏ lỡ những điều đặc biệt từ Kafi! 💳✨" />
    </div>
);

const Title = ({ className, title }: { className?: string; title: string }) => (
    <h2 className={twMerge("text-5xl font-bold text-center", className)}>{title}</h2>
);

const Description = ({ className, description }: { className?: string; description: string }) => (
    <p className={twMerge("text-center", className)}>{description}</p>
);

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
    <div className={twMerge("relative text-white text-2xl", className)}>
        <div className="relative w-full">
            <Image className="w-full -z-10" src={card} alt="card" />
            <div className="flex absolute top-0 left-0 right-0 bottom-0 p-12">
                <div className="flex-[1] flex flex-col justify-end">
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

const MyMembership = () => (
    <div className="grid grid-cols-9 gap-10 mt-6">
        <div className="col-span-4 space-y-8 pr-8 border-r-2 border-black">
            <h2 className="text-2xl font-semibold">Thành viên của bạn</h2>
            <MemberCard name="Nguyễn Văn A" phone="0123456789" point="100" loyalty="Vàng" />
            <MembershipProgress />
        </div>
        <div className="col-span-5 space-y-8">
            <h2 className="text-2xl font-semibold mb-4">Chương trình thành viên củea Kafi</h2>
            <MembershipTable />
            <PointConversion />
        </div>
    </div>
);

const MembershipProgress = () => (
    <div className="mt-6">
        <div className="flex items-center justify-between text-sm">
            <span>Đồng</span> <span>Bạc</span> <span>Vàng</span> <span>Kim Cương</span>
        </div>
        <div className="w-full h-1 bg-gray-300 rounded-full mt-2">
            <div className="h-1 bg-yellow-500 rounded-full w-2/4"></div>
        </div>
    </div>
);

const MembershipTable = () => (
    <table className="w-full bg-[#F9F9F9] border-collapse border border-[#B1D4E0] text-lg rounded-2xl overflow-hidden">
        <thead>
            <tr className="bg-green-100 text-xl h-16">
                <th className="border p-4">Hạng mức</th>
                <th className="border p-4">Điểm tích lũy</th>
                <th className="border p-4">Quyền lợi</th>
            </tr>
        </thead>
        <tbody className="text-center">
            <tr className="h-16"><td className="border p-4">Đồng</td><td className="border p-4">Từ hóa đơn đầu tiên</td><td className="border p-4">Không có</td></tr>
            <tr className="h-16"><td className="border p-4">Bạc</td><td className="border p-4">Từ 1000 điểm</td><td className="border p-4">Giảm 5% hóa đơn</td></tr>
            <tr className="h-16"><td className="border p-4">Vàng</td><td className="border p-4">Từ 2000 điểm</td><td className="border p-4">Giảm 10% hóa đơn</td></tr>
            <tr className="h-16"><td className="border p-4">Kim Cương</td><td className="border p-4">Từ 5000 điểm</td><td className="border p-4">Giảm 15% hóa đơn</td></tr>
        </tbody>
    </table>
);

const PointConversion = () => (
    <div className="mt-6 text-left">
        <h2 className="text-lg font-semibold">Quy tắc đổi điểm</h2>
        <p className="text-[#458353] font-bold text-xl">1.000 VND = 1 điểm</p>
    </div>
);
