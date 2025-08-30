import React from 'react';

const Footer = () => {
  return (
    <footer className="w-full bg-gradient-to-r from-amber-900 via-amber-800 to-amber-700 border-t-4 border-t-amber-400 relative mt-12">
      {/* Decorative gold border top */}
      <div className="w-full h-2 absolute top-0 left-0" style={{ background: 'linear-gradient(90deg, #b9935a 0%, #f2e1c2 100%)' }} />
      <div className="container py-10 flex flex-col items-center justify-center">
        <p className="text-center text-base font-display text-amber-100 drop-shadow-lg">
          © {new Date().getFullYear()} Parvathavardhini Sametha Ramalingeshwara Swamy Temple. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;