'use client';
import dynamic from 'next/dynamic';
export default function Home() {
  const HomePage = dynamic(() => import('../components/mainpage'), { ssr: false });
  return (
    <>
      <div className="h-full w-full">
        <HomePage />
      </div>
    </>
  );
}