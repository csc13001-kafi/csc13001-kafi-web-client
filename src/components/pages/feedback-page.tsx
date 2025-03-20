'use client'
import { twMerge } from "tailwind-merge";
import Image from 'next/image';


const FeedbackPage = () => (
    <div className="bg-gray-100 p-8 min-h-screen">
        <div className="mx-28 space-y-20 relative">
            <Intro />
        </div>
        <div className="min-h-screen flex justify-center items-center">
            <div className="max-w-3xl w-full bg-white rounded-2xl shadow-2xl space-y-6 p-8">
                <div className="flex items-center space-x-3 mb-4">
                    <Image src="/Logo.png" alt="Kafi Logo" width={200} height={200} />
                </div>
                <h3 className="text-xl font-bold mb-2">Customer Feedback</h3>
                <p className="text-black mb-6">
                    Đối với Kafi, khách hàng là châu báu. Bạn cho Kafi biết có thể cải thiện gì để mang đến dịch vụ tốt hơn cho bạn nhé!
                </p>
                <p className="text-black mb-6">
                    Nếu gặp bất kỳ vấn đề nào khiến bạn chưa hài lòng, vui lòng cho Chidori biết để có giải pháp khắc phục nhanh chóng ạ.
                </p>
                <FeedbackForm />
            </div>
        </div>
    </div>
);

const Intro = () => (
    <div className="space-y-6">
        <Title title="Chia sẻ cảm nhận – Giúp Kafi hoàn thiện hơn!" />
        <Description description="Hãy gửi feedback của bạn để chúng tôi có thể cải thiện và mang đến trải nghiệm cà phê tốt nhất" />
    </div>
);

const Title = ({ className, title }: { className?: string; title: string }) => (
    <h2 className={twMerge("text-5xl font-bold text-center", className)}>{title}</h2>
);

const Description = ({ className, description }: { className?: string; description: string }) => (
    <p className={twMerge("text-center", className)}>{description}</p>
);

const FeedbackForm = () => (
    <form className="space-y-4">
        <InputField label="Họ và tên" placeholder="Nhập họ tên" />
        <InputField label="Số điện thoại" placeholder="Nhập số điện thoại" />
        <InputField label="Email" placeholder="Nhập email" />
        <InputField label="Nội dung feedback" placeholder="Nhập nội dung" textarea />
        <button className="w-full bg-black text-white py-3 rounded-2xl font-semibold">
            Gửi feedback
        </button>
    </form>
);

interface InputFieldProps {
    label: string;
    placeholder: string;
    textarea?: boolean;
}

const InputField = ({ label, placeholder, textarea }: InputFieldProps) => (
    <div>
        <label className="block font-medium mb-1">{label}</label>
        {textarea ? (
            <textarea
                placeholder={placeholder}
                className="w-full p-3 bg-[#A4BBAA] text-black rounded-2xl border border-gray-400 focus:outline-none placeholder:text-black"
                rows={4}
            ></textarea>
        ) : (
            <input
                type="text"
                placeholder={placeholder}
                className="w-full p-3 bg-[#A4BBAA] text-black rounded-2xl border border-gray-400 focus:outline-none placeholder:text-black"
            />
        )}
    </div>
);

export default FeedbackPage;
