import { ContactForm } from './ContactForm';

const ContactSection = () => {
  return (
    <section id="contact" className="py-20">
      <div className="container">
        <h2 className="text-3xl font-bold text-center mb-8">Contact Us</h2>
        <p className="max-w-3xl mx-auto text-center text-muted-foreground mb-8">
          Have a question or want to get involved? Send us a message, and we will get back to you soon.
        </p>
        <div className="max-w-xl mx-auto">
          <ContactForm />
        </div>
      </div>
    </section>
  );
};

export default ContactSection;