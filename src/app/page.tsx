'use client';
import { HomePage } from '@/components/pages/home-page';

export default function Home() {
    // Now both authenticated and non-authenticated users see the home page
    return <HomePage />;
}
