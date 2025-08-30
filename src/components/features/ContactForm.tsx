'use client';

import { useFormState } from 'react-dom';
import { submitContactForm, type ContactFormState } from '@/app/actions';

// Removed legacy UI imports
// Fix: Define SubmitButton for form submission
function SubmitButton() {
  return (
    <button type="submit" className="w-full py-2 rounded-lg bg-yellow-800 hover:bg-yellow-700 text-white font-semibold transition-colors duration-200 shadow-md focus:outline-none focus:ring-2 focus:ring-yellow-400">
      Submit
    </button>
  );
}

const initialState: ContactFormState = {
  message: '',
};

export function ContactForm() {
  const [state, formAction] = useFormState(submitContactForm, initialState);

  return (
    <form action={formAction} className="space-y-6 bg-white/80 rounded-2xl border-2 border-amber-200 shadow-lg p-8">
      {state.message && (
        <div
          className={`rounded-lg px-4 py-3 text-base font-semibold text-center mb-4 ${state.errors ? 'bg-red-100 text-red-900 border border-red-400' : 'bg-amber-100 text-amber-900 border border-amber-400'}`}
          role="alert"
          aria-live="polite"
        >
          {state.message}
        </div>
      )}
      <div className="space-y-2">
  <label htmlFor="name">Name</label>
  <input id="name" name="name" placeholder="Your Name" required className="rounded-lg border border-yellow-700/30 focus:border-yellow-700 focus:ring-2 focus:ring-yellow-200" />
        {state.errors?.name && (
          <p className="text-sm font-medium text-red-700 mt-1">
            {state.errors.name.join(', ')}
          </p>
        )}
      </div>
      <div className="space-y-2">
        <label htmlFor="email">Email</label>
        <input
          id="email"
          name="email"
          type="email"
          placeholder="your.email@example.com"
          required
          className="rounded-lg border border-yellow-700/30 focus:border-yellow-700 focus:ring-2 focus:ring-yellow-200"
        />
        {state.errors?.email && (
          <p className="text-sm font-medium text-red-700 mt-1">
            {state.errors.email.join(', ')}
          </p>
        )}
      </div>
      <div className="space-y-2">
  <label htmlFor="message">Message</label>
  <textarea id="message" name="message" placeholder="Type your message here..." required className="rounded-lg border border-yellow-700/30 focus:border-yellow-700 focus:ring-2 focus:ring-yellow-200 min-h-[100px]" />
        {state.errors?.message && (
          <p className="text-sm font-medium text-red-700 mt-1">
            {state.errors.message.join(', ')}
          </p>
        )}
      </div>
      <div className="pt-2">
        <SubmitButton />
      </div>
    </form>
  );
}

