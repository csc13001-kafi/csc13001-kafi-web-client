"use client";
import Image from "next/image";
import { useCounterStore } from "@/providers/counter-store-provider";
import { Button } from "@/components/ui/button";
import image1 from "@/public/1.png";
import image2 from "@/public/2.png";
import image3 from "@/public/3.png";
import image4 from "@/public/4.png";
import image5 from "@/public/5.png";
import image6 from "@/public/6.png";
import image7 from "@/public/7.png";
import { Card, CardContent } from "@/components/ui/card";
import { twMerge } from "tailwind-merge";
import bg from "@/public/bg.png";

export const HomePage = () => {
  const { count, incrementCount, decrementCount } = useCounterStore((state) => state);

  return (
    <>
      <Image className="absolute left-0 right-0 top-0 bottom-0" src={bg} alt={"heh"} />
    <div className="space-y-32 relative">
      <Space />
      <div className="mx-40 space-y-32">
        <Sellings />
        <Member />
      </div>
      <Footer />
    </div>
    </>

  );
};

const Space = () => (
  <div className="space-y-6">
    <Title title="Không gian tại Kafi - Ấm áp & thư giãn ☕✨" />
    <Description description="Góc nhỏ dành cho bạn, nơi hội tụ hương cà phê, ánh đèn ấm áp và những bản nhạc nhẹ nhàng. Dù là làm việc, gặp gỡ hay tận hưởng phút giây riêng tư, Kafi luôn chào đón bạn! 🌿📖" />
    <ImageList />
  </div>
);

const Title = ({ className, title }: { className?: string; title: string }) => (
  <h2 className={twMerge("text-5xl font-bold text-center", className)}>{title}</h2>
);

const Description = ({ className, description }: { className?: string; description: string }) => (
  <p className={twMerge("text-center m-auto", className)}>{description}</p>
);

const ImageList = () => (
  <div className="flex justify-center gap-8">
    {[image1, image2, image3, image4].map((img, index) => (
      <Image key={index} src={img} alt={`image-${index + 1}`} />
    ))}
  </div>
);

const Sellings = () => (
  <div className="space-y-6">
    <Title title="Best Seller - Đừng bỏ lỡ! ⭐☕" />
    <Description description="Những món được yêu thích nhất tại Kafi, ai thử cũng mê! Bạn đã chọn được hương vị 'chân ái' của mình chưa? 😍🍰" />
    <ListCard />
    <Button className="w-max block m-auto px-10 rounded-full">Menu</Button>
  </div>
);

const ProductCard = ({ image, name, price }: { image: string; name: string; price: string }) => (
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
  <div className="flex justify-between gap-8">
    <ProductCard image={image7} name="Cà phê đen nóng" price="40.000" />
    <ProductCard image={image5} name="Plain Croissant" price="40.000" />
    <ProductCard image={image6} name="Cà Phê Sữa Nóng" price="40.000" />
  </div>
);

function Member() {
  return (
    <div className="flex gap-12">
      <Information className="flex-[1]" />
      <MemberCard className="flex-[1]" name="Nguyễn Văn A" phone="0123456789" point="100" loyalty="Vàng" />
    </div>
  );
}

function Information({ className }: { className?: string }) {
  return (
    <div className={twMerge("flex flex-col", className)}>
      <Title className="text-left" title="Thành viên Kafi – Đặc quyền dành riêng cho bạn! 🎉☕" />
      <Description className="text-left" description="Tích điểm, nhận ưu đãi, tận hưởng những đặc quyền chỉ dành cho thành viên. Đăng ký ngay để không bỏ lỡ những điều đặc biệt từ Kafi! 💳✨" />
      <Button className="w-max px-10 rounded-full">Đăng ký thành viên</Button>
    </div>
  );
}

import card from "@/public/card 6.png";

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
    <div className={twMerge("relative text-white text-2xl", className)}>
      <div className="relative w-[90%] float-right h-auto">
      <Image className="w-full -z-10" src={card} alt={"hhhh"} />
      <div className="flex absolute top-0 left-0 right-0 bottom-0 p-12">
        <div className="flex-[1] flex flex-col justify-end">
          <p className="font-bold">{name}</p>
          <p className="font-bold">{phone}</p>
        </div>
        <div className="flex-[1]">
          <p className="text-end ">{loyalty}</p>
          <p className="text-end font-bold">{point}</p>
        </div>
      </div>
      </div>
    </div>
  );
}

function Footer(){
  return (
    <div className = "px-40 pt-12 pb-4 bg-[#96B79E]">
      <Info />
      <Copyright />
    </div>
  )
}

function Info(){
  return (
    <div className ="flex justify-between gap-9">
      <Kafi />
      <Navbar/>
      <Contact />
    </div>
  )
}

function Kafi(){
  return (
    <div className = "flex flex-col">
      <h1 className =" font-climateCrisis">Kafi</h1>
      <p>Coffee Shop</p>
    </div>
  )
}

function Navbar(){
  return (
    <div className = "flex flex-col space-y-6">

      <a>Menu</a>
      <a>Chương trình thành viên </a>
    </div>
  )
}

import { EnvironmentOutlined, PhoneOutlined, MailOutlined, ClockCircleOutlined } from '@ant-design/icons';

function Contact(){
  return (
    <div className = "space-y-6">
      <h1 className="font-bold">Liên hệ với chúng tôi</h1>
      <p><EnvironmentOutlined /> 222 Nguyễn Văn Cừ, Quận 5</p>
      <p><PhoneOutlined /> 0912982282</p>
      <p><MailOutlined /> kaficoffee@gmail.com</p>
      <p><ClockCircleOutlined /> Thứ 2 - Chủ Nhật / 10:00 AM - 8:00 PM</p>
    </div>
  )
}

function Copyright(){
  return (
    <div>
    <p className="text-center  mt-6">
        © 2025 KafiCoffee
      </p>
    </div>
  )
}