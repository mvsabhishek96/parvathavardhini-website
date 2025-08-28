import React from 'react';

const GallerySection = () => {
  return (
    <section id="gallery" className="py-20">
      <div className="container">
        <h2 className="text-3xl font-bold text-center mb-12">Gallery</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* Placeholder images */}
            <div className="bg-muted h-48 w-full rounded-md"></div>
            <div className="bg-muted h-48 w-full rounded-md"></div>
            <div className="bg-muted h-48 w-full rounded-md"></div>
            <div className="bg-muted h-48 w-full rounded-md"></div>
            <div className="bg-muted h-48 w-full rounded-md"></div>
            <div className="bg-muted h-48 w-full rounded-md"></div>
            <div className="bg-muted h-48 w-full rounded-md"></div>
            <div className="bg-muted h-48 w-full rounded-md"></div>
        </div>
      </div>
    </section>
  );
};

export default GallerySection;