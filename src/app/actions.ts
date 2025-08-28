'use server';

import { adminDb } from '@/lib/firebase/admin';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

// Define a schema for validation
const contactSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Invalid email address." }),
  message: z.string().min(10, { message: "Message must be at least 10 characters." }),
});

export type ContactFormState = {
  message: string;
  errors?: {
    name?: string[];
    email?: string[];
    message?: string[];
  };
};

export async function submitContactForm(
  prevState: ContactFormState,
  formData: FormData,
): Promise<ContactFormState> {
  const validatedFields = contactSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    message: formData.get('message'),
  });

  // Return errors if validation fails
  if (!validatedFields.success) {
    return {
      message: "Validation failed.",
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    await adminDb.collection('contacts').add({
      name: validatedFields.data.name,
      email: validatedFields.data.email,
      message: validatedFields.data.message,
      submittedAt: new Date(),
    });

    revalidatePath('/'); // Revalidate the homepage if needed
    return { message: 'Thank you for your message!' };
  } catch (error) {
    console.error("Error submitting form:", error);
    return { message: 'An error occurred. Please try again.' };
  }
}