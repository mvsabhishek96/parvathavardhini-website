'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import Link from 'next/link';
import { Menu } from 'lucide-react';

const MobileNav = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="md:hidden">
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left">
          <div className="flex flex-col space-y-4 mt-8">
            <Link href="/" className="font-bold" onClick={() => setIsOpen(false)}>Temple Logo</Link>
            <nav className="flex flex-col space-y-2">
              <Link href="#about" onClick={() => setIsOpen(false)}>About</Link>
              <Link href="#services" onClick={() => setIsOpen(false)}>Services</Link>
              <Link href="#gallery" onClick={() => setIsOpen(false)}>Gallery</Link>
              <Link href="#contact" onClick={() => setIsOpen(false)}>Contact</Link>
            </nav>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default MobileNav;