import React from 'react';


const AboutSection = () => {
  return (
    <section id="about" className="py-20 bg-gradient-to-b from-amber-50 via-amber-100 to-white relative">
      <div className="container max-w-3xl mx-auto">
        <div className="rounded-2xl border-2 border-amber-400 bg-white/90 shadow-xl p-10 relative">
          {/* Decorative gold border top */}
          <div className="absolute left-0 top-0 w-full h-2 rounded-t-2xl" style={{ background: 'linear-gradient(90deg, #b9935a 0%, #f2e1c2 100%)' }} />
          <h2 className="text-4xl font-display font-bold text-center mb-8 text-amber-900 drop-shadow-lg tracking-wide">
            About Us
          </h2>
          <p className="text-lg text-center text-amber-900/90 leading-relaxed font-body">
            Nestled in the heart of our community, the Sri Parvathavardhini Sametha Ramalingeshwara Swamy Temple is a sanctuary of peace and spiritual devotion. Our history is rich with tales of faith and divine grace, stretching back generations. We are dedicated to preserving the sacred traditions of Shaivism and providing a space for worship, meditation, and cultural celebration. Our mission is to foster a vibrant spiritual community, offering services and guidance to all who seek solace and a deeper connection with the divine.
          </p>
          {/* Decorative gold border bottom */}
          <div className="absolute left-0 bottom-0 w-full h-2 rounded-b-2xl" style={{ background: 'linear-gradient(90deg, #b9935a 0%, #f2e1c2 100%)' }} />
        </div>
      </div>
    </section>
  );
};

export default AboutSection;