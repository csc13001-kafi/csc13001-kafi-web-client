'use client';
import { twMerge } from 'tailwind-merge';
import Image from 'next/image';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { useEffect, useState } from 'react';
import api from '@/lib/api';

// Fallback image for products without images
import placeholderImage from '@/public/menu/images/coffee-den-da.png';

// Type definitions for API responses
interface Product {
    id: string;
    name: string;
    price: number;
    description?: string;
    image?: string;
    categoryId: string;
}

interface Category {
    id: string;
    name: string;
    image?: string;
}

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

function CategoryList({
    categories,
    selectedCategory,
    onSelectCategory,
}: {
    categories: Category[];
    selectedCategory: string | null;
    onSelectCategory: (categoryId: string | null) => void;
}) {
    return (
        <div className="flex select-none justify-center">
            <div className="grid grid-cols-5 gap-6 md:gap-10 lg:gap-20">
                {categories.map((category) => (
                    <div
                        key={category.id}
                        className={`flex h-56 w-40 cursor-pointer flex-col items-center justify-center rounded-3xl transition-colors ${
                            selectedCategory === category.id
                                ? 'bg-green-900 text-white'
                                : 'bg-[#A4BBAA] hover:bg-opacity-90'
                        }`}
                        onClick={() => onSelectCategory(category.id)}
                    >
                        <div className="flex h-28 w-28 items-center justify-center">
                            <Image
                                src={category.image || ''}
                                alt={category.name}
                                width={50}
                                height={50}
                                className="rounded-xl object-cover"
                            />
                        </div>
                        <p className="mt-2 text-lg font-medium">
                            {category.name}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}

function ProductList({ products }: { products: Product[] }) {
    const [imgError, setImgError] = useState<Record<string, boolean>>({});

    return (
        <div className="grid select-none grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {products.map((product) => (
                <div
                    key={product.id}
                    className="flex h-[250px] flex-col items-center justify-between rounded-2xl bg-white p-4 shadow-md transition-transform hover:scale-105"
                >
                    <div className="flex h-[120px] w-[120px] items-center justify-center">
                        <Image
                            src={
                                imgError[product.id] || !product.image
                                    ? placeholderImage
                                    : product.image
                            }
                            alt={product.name}
                            width={120}
                            height={120}
                            className="rounded-xl object-cover"
                            onError={() =>
                                setImgError((prev) => ({
                                    ...prev,
                                    [product.id]: true,
                                }))
                            }
                        />
                    </div>
                    <p className="text-center text-lg font-semibold">
                        {product.name}
                    </p>
                    <p className="text-center text-sm font-medium text-gray-500">
                        {product.price?.toLocaleString()} đ
                    </p>
                </div>
            ))}
        </div>
    );
}

export default function Menu() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(
        null,
    );
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Fetch categories and products
    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                const response = await api.get('/categories/products');

                // Handle different API response structures
                const data = response.data;
                console.log(data);
                if (data.categories && Array.isArray(data.categories)) {
                    setCategories(data.categories);
                }

                if (data.products && Array.isArray(data.products)) {
                    setProducts(data.products);
                    setFilteredProducts(data.products);
                }

                setError(null);
            } catch (err) {
                console.error('Error fetching menu data:', err);
                setError('Bạn cần đăng nhập để xem thông tin menu');
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    // Filter products by category
    const handleCategorySelect = (categoryId: string | null) => {
        setSelectedCategory(categoryId);

        if (categoryId === null) {
            setFilteredProducts(products);
        } else {
            const filtered = products.filter(
                (product) => product.categoryId === categoryId,
            );
            setFilteredProducts(filtered);
        }
    };

    return (
        <div className="flex min-h-screen flex-col bg-gray-100">
            <Header />
            <div className="flex-1 p-4 md:p-8">
                <div className="relative space-y-12 md:space-y-20">
                    <div className="mx-auto max-w-7xl justify-center space-y-12 md:space-y-20">
                        <Intro />

                        {isLoading ? (
                            <div className="flex h-56 items-center justify-center">
                                <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-green-700"></div>
                            </div>
                        ) : error ? (
                            <div className="flex h-56 items-center justify-center">
                                <p className="text-center text-red-500">
                                    {error}
                                </p>
                            </div>
                        ) : (
                            <>
                                <CategoryList
                                    categories={categories}
                                    selectedCategory={selectedCategory}
                                    onSelectCategory={handleCategorySelect}
                                />
                                <div className="mb-4 w-full border-b-[3px] border-black"></div>
                                {filteredProducts.length > 0 ? (
                                    <ProductList products={filteredProducts} />
                                ) : (
                                    <p className="text-center">
                                        Không có sản phẩm nào trong danh mục
                                        này.
                                    </p>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}
