'use client';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import image1 from '@/public/home-page/1.png';
import image2 from '@/public/home-page/2.png';
import image3 from '@/public/home-page/3.png';
import image4 from '@/public/home-page/4.png';
import image5 from '@/public/home-page/5.png';
import image6 from '@/public/home-page/6.png';
import image7 from '@/public/home-page/7.png';
import bg2 from '@/public/home-page/bg2.png';
import bg3 from '@/public/home-page/bg3.png';
import card from '@/public/home-page/card 6.png';
import { Card, CardContent } from '@/components/ui/card';
import { twMerge } from 'tailwind-merge';
import bg from '@/public/home-page/bg.png';
import { StaticImageData } from 'next/image';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { useRouter } from 'next/navigation';

export const HomePage = () => {
    return (
        <div className="relative flex min-h-screen flex-col">
            {/* Background image that covers everything */}
            <div className="fixed inset-0 -z-10">
                <Image
                    className="h-full w-full object-cover"
                    src={bg}
                    alt="Background"
                    fill
                    priority
                />
            </div>

            {/* Content container */}
            <div className="relative flex-1">
                <Header />
                <div className="mx-28 mb-40 space-y-48">
                    <Introduction />
                    <Space />
                    <Sellings />
                    <Member />
                </div>
            </div>
            <Footer />
        </div>
    );
};

const Space = () => (
    <div className="select-none space-y-6">
        <Title title="Không gian tại Kafi - Ấm áp & thư giãn ☕✨" />
        <Description description="Góc nhỏ dành cho bạn, nơi hội tụ hương cà phê, ánh đèn ấm áp và những bản nhạc nhẹ nhàng. Dù là làm việc, gặp gỡ hay tận hưởng phút giây riêng tư, Kafi luôn chào đón bạn! 🌿📖" />
        <ImageList />
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

const ImageList = () => (
    <div className="flex justify-center gap-8">
        {[image1, image2, image3, image4].map((img, index) => (
            <Image key={index} src={img} alt={`image-${index + 1}`} />
        ))}
    </div>
);

const Sellings = () => {
    const router = useRouter();

    return (
        <div className="select-none space-y-6">
            <Title title="Best Seller - Đừng bỏ lỡ! ⭐☕" />
            <Description description="Những món được yêu thích nhất tại Kafi, ai thử cũng mê! Bạn đã chọn được hương vị 'chân ái' của mình chưa? 😍🍰" />
            <ListCard />
            <Button
                className="m-auto block w-max rounded-full px-10"
                onClick={() => router.push('/menu')}
            >
                Menu &gt;
            </Button>
        </div>
    );
};

const ProductCard = ({
    image,
    name,
    price,
}: {
    image: string | StaticImageData;
    name: string;
    price: string;
}) => (
    <Card>
        <Image src={image} alt={name} />
        <CardContent className="flex justify-center gap-3">
            <p>{name}</p>
            <p> | </p>
            <p>{price}</p>
        </CardContent>
    </Card>
);

const ListCard = () => (
    <div className="flex select-none justify-between gap-8">
        <ProductCard image={image7} name="Cà phê đen nóng" price="40.000" />
        <ProductCard image={image5} name="Plain Croissant" price="40.000" />
        <ProductCard image={image6} name="Cà Phê Sữa Nóng" price="40.000" />
    </div>
);

function Member() {
    return (
        <div className="flex select-none gap-12">
            <Information className="flex-[1]" />
            <MemberCard
                className="flex-[1]"
                name="Nguyễn Văn A"
                phone="0123456789"
                point="100"
                loyalty="Vàng"
            />
        </div>
    );
}

function Information({ className }: { className?: string }) {
    const router = useRouter();
    return (
        <div
            className={twMerge(
                'flex select-none flex-col gap-y-7 py-8',
                className,
            )}
        >
            <Title
                className="text-left"
                title="Thành viên Kafi – Đặc quyền dành riêng cho bạn! 🎉☕"
            />
            <Description
                className="text-left"
                description="Tích điểm, nhận ưu đãi, tận hưởng những đặc quyền chỉ dành cho thành viên. Đăng ký ngay để không bỏ lỡ những điều đặc biệt từ Kafi! 💳✨"
            />
            <Button
                className="w-max rounded-full px-10"
                onClick={() => router.push('/membership')}
            >
                Chương trình thành viên &gt;
            </Button>
        </div>
    );
}

function MemberCard({
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
}) {
    return (
        <div
            className={twMerge(
                'relative select-none text-2xl text-white',
                className,
            )}
        >
            <div className="relative float-right h-auto w-[90%]">
                <Image className="-z-10 w-full" src={card} alt={'hhhh'} />
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
}

function Introduction() {
    return (
        <section className="relative gap-12 px-0 py-0">
            <div className="flex flex-col items-center gap-32 md:flex-row">
                <MainImage />
                <MainContent />
            </div>
            <SmallImage />
        </section>
    );
}

function MainImage() {
    return (
        <div className="relative left-10 w-[90%]">
            <Image className="w-full" src={bg3} alt={'hhhh'} />
        </div>
    );
}

function MainContent() {
    return (
        <div className="w-1/2 select-none flex-col text-justify">
            <Title
                className="text-left text-2xl"
                title="Kafi – Hơn cả một tách cà phê"
            />
            <p>
                Chào mừng bạn đến với Kafi, quán cà phê nhỏ mang đến không gian
                ấm cúng và những ly cà phê đậm đà. Tại Kafi, bạn có thể{' '}
                <strong>đặt giao hàng tận nơi, đặt chỗ trước</strong> để tận
                hưởng không gian thoải mái, và tham gia{' '}
                <strong>chương trình thành viên</strong> với nhiều ưu đãi hấp
                dẫn. Hãy để mỗi khoảnh khắc cùng Kafi trở nên đặc biệt hơn! ☕✨
            </p>
        </div>
    );
}

function SmallImage() {
    return (
        <div className="absolute -bottom-8 left-1/3 w-[30%]">
            <Image className="-z-10 w-full" src={bg2} alt={'hhhh'} />
        </div>
    );
}
