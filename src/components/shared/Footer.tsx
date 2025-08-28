import React from 'react';

const Footer = () => {
  return (
    <footer className="border-t">
      <div className="container py-8">
        <p className="text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} Parvathavardhini Sametha Ramalingeshwara Swamy Temple. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;