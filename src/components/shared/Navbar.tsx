import React from 'react';
import Link from 'next/link';
import MobileNav from './MobileNav';
import { useAuth } from './AuthProvider';
import { Button } from '@/components/ui/button';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase/client';


const Navbar = () => {
  const { user } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error signing out", error);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 shadow-lg border-b-4 border-b-amber-400" style={{ boxShadow: '0 4px 24px 0 rgba(185, 147, 90, 0.08)' }}>
      {/* Decorative gold border */}
      <div className="w-full h-2" style={{ background: 'linear-gradient(90deg, #b9935a 0%, #f2e1c2 100%)' }} />
      <div className="container flex h-20 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-3">
            <span className="text-3xl text-amber-700"><i className="fas fa-om"></i></span>
            <span className="font-display text-xl font-bold text-amber-900 tracking-wide drop-shadow-lg">Parvathavardhini Temple</span>
          </Link>
          <nav className="hidden md:flex items-center gap-8 text-base font-semibold">
            <Link href="#about" className="transition-colors text-amber-900 hover:text-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-400 px-2 py-1 rounded">About</Link>
            <Link href="#services" className="transition-colors text-amber-900 hover:text-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-400 px-2 py-1 rounded">Services</Link>
            <Link href="#gallery" className="transition-colors text-amber-900 hover:text-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-400 px-2 py-1 rounded">Gallery</Link>
            <Link href="#contact" className="transition-colors text-amber-900 hover:text-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-400 px-2 py-1 rounded">Contact</Link>
            {user && (
              <Link href="/submissions" className="transition-colors text-amber-900 hover:text-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-400 px-2 py-1 rounded">View Submissions</Link>
            )}
          </nav>
        </div>
        <div className="flex items-center gap-4">
          {user ? (
            <>
              <span className="hidden md:inline-block font-semibold text-amber-900 bg-amber-100 px-4 py-2 rounded-lg shadow-sm border border-amber-300 mr-2">
                <i className="fas fa-user mr-2 text-amber-700" />
                {user.name || user.email}
              </span>
              <Button onClick={handleSignOut} className="bg-amber-700 hover:bg-amber-800 text-white font-semibold px-4 py-2 rounded-lg shadow-md">Sign Out</Button>
            </>
          ) : (
            <Link href="#login" className="bg-amber-700 hover:bg-amber-800 text-white font-semibold px-4 py-2 rounded-lg shadow-md flex items-center justify-center">Committee Login</Link>
          )}
          <MobileNav />
        </div>
      </div>
    </header>
  );
};

export default Navbar;