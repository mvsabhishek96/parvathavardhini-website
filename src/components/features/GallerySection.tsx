import React from 'react';


const GallerySection = () => {
  return (
    <section id="gallery" className="py-20 bg-gradient-to-b from-white via-amber-50 to-amber-100 relative">
      <div className="container max-w-5xl mx-auto">
        <div className="rounded-2xl border-2 border-amber-400 bg-white/90 shadow-xl p-10 relative">
          {/* Decorative gold border top */}
          <div className="absolute left-0 top-0 w-full h-2 rounded-t-2xl" style={{ background: 'linear-gradient(90deg, #b9935a 0%, #f2e1c2 100%)' }} />
          <h2 className="text-4xl font-display font-bold text-center mb-12 text-amber-900 drop-shadow-lg tracking-wide">
            Gallery
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {/* Placeholder images with hover zoom */}
            {[1,2,3,4,5,6,7,8].map((i) => (
              <div
                key={i}
                className="bg-muted h-48 w-full rounded-xl overflow-hidden shadow-md border border-amber-200 group relative cursor-pointer transition-transform duration-200 hover:scale-105"
              >
                {/* Replace with <Image ... /> for real images */}
                <div className="absolute inset-0 bg-gradient-to-t from-amber-900/20 to-transparent z-10" />
              </div>
            ))}
          </div>
          {/* Decorative gold border bottom */}
          <div className="absolute left-0 bottom-0 w-full h-2 rounded-b-2xl" style={{ background: 'linear-gradient(90deg, #b9935a 0%, #f2e1c2 100%)' }} />
        </div>
      </div>
    </section>
  );
};

export default GallerySection;