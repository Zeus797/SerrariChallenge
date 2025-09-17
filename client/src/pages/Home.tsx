import { useState } from 'react';
import { useLocation } from 'wouter';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import CourseGrid from '@/components/CourseGrid';
import Footer from '@/components/Footer';
import { ThemeProvider } from '@/components/ThemeProvider';

export default function Home() {
  const [, setLocation] = useLocation();

  const handleStartTest = (courseId: string) => {
    console.log('Navigating to test:', courseId);
    setLocation(`/test/${courseId}`);
  };

  return (
    <ThemeProvider>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">
          <Hero />
          <CourseGrid onStartTest={handleStartTest} />
        </main>
        <Footer />
      </div>
    </ThemeProvider>
  );
}