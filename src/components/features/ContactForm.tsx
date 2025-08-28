'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { submitContactForm, type ContactFormState } from '@/app/actions';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

const initialState: ContactFormState = {
  message: '',
};

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending}>
      {pending ? 'Submitting...' : 'Submit Message'}
    </Button>
  );
}

export function ContactForm() {
  const [state, formAction] = useFormState(submitContactForm, initialState);

  return (
    <form action={formAction} className="space-y-4">
      {state.message && (
        <p
          className={`text-sm ${
            state.errors ? 'text-destructive' : 'text-primary'
          }`}
        >
          {state.message}
        </p>
      )}
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input id="name" name="name" placeholder="Your Name" required />
        {state.errors?.name && (
          <p className="text-sm font-medium text-destructive">
            {state.errors.name.join(', ')}
          </p>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="your.email@example.com"
          required
        />
        {state.errors?.email && (
          <p className="text-sm font-medium text-destructive">
            {state.errors.email.join(', ')}
          </p>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="message">Message</Label>
        <Textarea
          id="message"
          name="message"
          placeholder="Your message to us"
          required
        />
        {state.errors?.message && (
          <p className="text-sm font-medium text-destructive">
            {state.errors.message.join(', ')}
          </p>
        )}
      </div>
      <SubmitButton />
    </form>
  );
}