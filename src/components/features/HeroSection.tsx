import React from 'react';
import { Button } from '@/components/ui/button';

const HeroSection = () => {
  return (
    <section id="hero" className="relative h-[600px] flex items-center justify-center text-white text-center p-4" style={{backgroundImage: "url('/hero-background.jpg')", backgroundSize: 'cover', backgroundPosition: 'center'}}>
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div className="relative z-10">
        <h1 className="text-4xl md:text-6xl font-bold">Welcome to Our Temple</h1>
        <p className="mt-4 text-lg md:text-xl">A place of peace, devotion, and community.</p>
        <div className="mt-8">
          <Button size="lg">Donate Now</Button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;