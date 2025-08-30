import React from 'react';
import { Button } from '@/components/ui/button';


const HeroSection = () => {
  return (
    <section
      id="hero"
      className="relative h-[600px] flex items-center justify-center text-white text-center p-4 overflow-hidden"
      style={{
        backgroundImage: "url('/hero-background.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Subtle traditional motif overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-amber-900/40 to-transparent z-0" />
      <div className="absolute inset-0 bg-[url('/motif.svg')] bg-repeat opacity-10 z-0" />
      <div className="relative z-10 flex flex-col items-center justify-center w-full">
        <h1 className="text-4xl md:text-6xl font-display font-bold text-amber-100 drop-shadow-[0_4px_24px_rgba(0,0,0,0.7)]">
          Welcome to Our Temple
        </h1>
        <p className="mt-4 text-lg md:text-2xl font-body text-amber-100/90 drop-shadow-md">
          A place of peace, devotion, and community.
        </p>
        <div className="mt-10">
          <Button size="lg" className="bg-gradient-to-r from-amber-700 via-amber-500 to-yellow-400 text-white font-bold px-8 py-4 rounded-xl shadow-lg hover:from-yellow-600 hover:to-amber-700 transition-all duration-200 text-lg">
            <i className="fas fa-donate mr-2"></i> Donate Now
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;