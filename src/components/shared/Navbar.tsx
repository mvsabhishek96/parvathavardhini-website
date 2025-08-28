import React from 'react';
import Link from 'next/link';
import MobileNav from './MobileNav';
import AuthButton from './AuthButton';

const Navbar = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex items-center">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <span className="font-bold">Temple Logo</span>
          </Link>
          <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
            <Link href="#about" className="transition-colors hover:text-foreground/80">About</Link>
            <Link href="#services" className="transition-colors hover:text-foreground/80">Services</Link>
            <Link href="#gallery" className="transition-colors hover:text-foreground/80">Gallery</Link>
            <Link href="#contact" className="transition-colors hover:text-foreground/80">Contact</Link>
          </nav>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-4">
          <div className="hidden md:block">
            <AuthButton />
          </div>
          <MobileNav />
        </div>
      </div>
    </header>
  );
};

export default Navbar;