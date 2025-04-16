'use client';
import { twMerge } from 'tailwind-merge';
import Image from 'next/image';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { useState } from 'react';
import api from '@/lib/api';
import { toast } from 'react-hot-toast';

const FeedbackPage = () => (
    <div className="flex min-h-screen select-none flex-col bg-gray-100">
        <Header />
        <div className="flex-1 p-8">
            <div className="relative mx-28 space-y-20">
                <Intro />
            </div>
            <div className="flex min-h-screen items-center justify-center">
                <div className="w-full max-w-3xl space-y-6 rounded-2xl bg-white p-8 shadow-2xl">
                    <div className="mb-4 flex items-center space-x-3">
                        <Image
                            src="/Logo.png"
                            alt="Kafi Logo"
                            width={200}
                            height={200}
                        />
                    </div>
                    <h3 className="mb-2 text-xl font-bold">
                        Customer Feedback
                    </h3>
                    <p className="mb-6 text-black">
                        Đối với Kafi, khách hàng là châu báu. Bạn cho Kafi biết
                        có thể cải thiện gì để mang đến dịch vụ tốt hơn cho bạn
                        nhé!
                    </p>
                    <p className="mb-6 text-black">
                        Nếu gặp bất kỳ vấn đề nào khiến bạn chưa hài lòng, vui
                        lòng cho Chidori biết để có giải pháp khắc phục nhanh
                        chóng ạ.
                    </p>
                    <FeedbackForm />
                </div>
            </div>
        </div>
        <Footer />
    </div>
);

const Intro = () => (
    <div className="space-y-6">
        <Title title="Chia sẻ cảm nhận – Giúp Kafi hoàn thiện hơn!" />
        <Description description="Hãy gửi feedback của bạn để chúng tôi có thể cải thiện và mang đến trải nghiệm cà phê tốt nhất" />
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

const FeedbackForm = () => {
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        message: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

        // Clear error when user types
        if (errors[name]) {
            setErrors((prev) => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
    };

    const validate = () => {
        const newErrors: { [key: string]: string } = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Vui lòng nhập họ tên';
        }

        if (!formData.phone.trim()) {
            newErrors.phone = 'Vui lòng nhập số điện thoại';
        } else if (!/^[0-9]{10,11}$/.test(formData.phone)) {
            newErrors.phone = 'Số điện thoại không hợp lệ';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'Vui lòng nhập email';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email không hợp lệ';
        }

        if (!formData.message.trim()) {
            newErrors.message = 'Vui lòng nhập nội dung feedback';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validate()) {
            return;
        }

        try {
            setIsSubmitting(true);

            await api.post('/users/feedback', formData);

            setFormData({
                name: '',
                phone: '',
                email: '',
                message: '',
            });

            toast.success('Cảm ơn bạn đã gửi feedback!');
        } catch (error) {
            console.error('Error submitting feedback:', error);
            toast.error(
                'Có lỗi xảy ra khi gửi feedback. Vui lòng thử lại sau.',
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form className="space-y-4" onSubmit={handleSubmit}>
            <InputField
                label="Họ và tên"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Nhập họ tên"
                error={errors.name}
            />
            <InputField
                label="Số điện thoại"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Nhập số điện thoại"
                error={errors.phone}
            />
            <InputField
                label="Email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Nhập email"
                error={errors.email}
            />
            <InputField
                label="Nội dung feedback"
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Nhập nội dung"
                textarea
                error={errors.message}
            />
            <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full rounded-2xl py-3 font-semibold ${
                    isSubmitting
                        ? 'cursor-not-allowed bg-gray-400'
                        : 'bg-black text-white hover:bg-gray-800'
                }`}
            >
                {isSubmitting ? 'Đang gửi...' : 'Gửi feedback'}
            </button>
        </form>
    );
};

interface InputFieldProps {
    label: string;
    name: string;
    value: string;
    onChange: (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => void;
    placeholder: string;
    textarea?: boolean;
    error?: string;
}

const InputField = ({
    label,
    name,
    value,
    onChange,
    placeholder,
    textarea,
    error,
}: InputFieldProps) => (
    <div>
        <label className="mb-1 block font-medium">{label}</label>
        {textarea ? (
            <textarea
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className={`w-full rounded-2xl border bg-[#A4BBAA] p-3 text-black ${
                    error ? 'border-red-500' : 'border-gray-400'
                } placeholder:text-black focus:outline-none focus:ring-2 focus:ring-green-500`}
                rows={4}
            ></textarea>
        ) : (
            <input
                type="text"
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className={`w-full rounded-2xl border bg-[#A4BBAA] p-3 text-black ${
                    error ? 'border-red-500' : 'border-gray-400'
                } placeholder:text-black focus:outline-none focus:ring-2 focus:ring-green-500`}
            />
        )}
        {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
);

export default FeedbackPage;
