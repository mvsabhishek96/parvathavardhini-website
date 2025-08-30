import { ContactForm } from './ContactForm';


const ContactSection = () => {
  return (
    <section id="contact" className="py-20 bg-gradient-to-b from-amber-100 via-white to-amber-50 relative">
      <div className="container max-w-3xl mx-auto">
        <div className="rounded-2xl border-2 border-amber-400 bg-white/90 shadow-xl p-10 relative">
          {/* Decorative gold border top */}
          <div className="absolute left-0 top-0 w-full h-2 rounded-t-2xl" style={{ background: 'linear-gradient(90deg, #b9935a 0%, #f2e1c2 100%)' }} />
          <h2 className="text-4xl font-display font-bold text-center mb-8 text-amber-900 drop-shadow-lg tracking-wide">
            Contact Us
          </h2>
          <p className="text-lg text-center text-amber-900/90 mb-8 font-body">
            Have a question or want to get involved? Send us a message, and we will get back to you soon.
          </p>
          <div className="max-w-xl mx-auto">
            <ContactForm />
          </div>
          {/* Decorative gold border bottom */}
          <div className="absolute left-0 bottom-0 w-full h-2 rounded-b-2xl" style={{ background: 'linear-gradient(90deg, #b9935a 0%, #f2e1c2 100%)' }} />
        </div>
      </div>
    </section>
  );
};

export default ContactSection;