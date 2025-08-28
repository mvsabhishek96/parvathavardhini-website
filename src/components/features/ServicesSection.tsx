import React from 'react';
import { adminDb } from '@/lib/firebase/admin';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

interface Service {
  id: string;
  name: string;
  description: string;
}

async function getServices(): Promise<Service[]> {
  try {
    const servicesSnapshot = await adminDb.collection('services').get();
    if (servicesSnapshot.empty) {
      return [];
    }
    return servicesSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as Service[];
  } catch (error) {
    console.error("Error fetching services:", error);
    return []; // Return empty array on error to prevent build failure
  }
}

const ServicesSection = async () => {
  const services = await getServices();

  return (
    <section id="services" className="py-20">
      <div className="container">
        <h2 className="text-3xl font-bold text-center mb-12">Our Services</h2>
        {services && services.length > 0? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => (
              <Card key={service.id}>
                <CardHeader>
                  <CardTitle>{service.name}</CardTitle>
                  <CardDescription>{service.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground">
            Services information coming soon.
          </p>
        )}
      </div>
    </section>
  );
};

export default ServicesSection;