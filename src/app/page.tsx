import type { Metadata } from 'next';
import AboutSection from '@/components/features/AboutSection';
import ContactSection from '@/components/features/ContactSection';

export const metadata: Metadata = {
  title: 'Sri Parvathavardhini Temple | Welcome',
  description:
    'Official website for the Sri Parvathavardhini Sametha Ramalingeshwara Swamy Temple. Discover our history, services, and community events.',
};

export default function HomePage() {
  return (
    <main>
      {/* You can add a Hero section or other components here */}
      <AboutSection />
      <ContactSection />
      {/* You can add a Footer or other components here */}
    </main>
  );
}