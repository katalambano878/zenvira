'use client';

import { useState } from 'react';

export default function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');
    try {
      const res = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) throw new Error('subscribe failed');
      setSubmitStatus('success');
      setEmail('');
    } catch {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="rounded-[2rem] bg-store-sand border border-stone-200/80 px-6 sm:px-10 py-12 md:py-14 text-center">
      <p className="text-xs tracking-[0.2em] uppercase text-store-muted mb-3">Stay inspired</p>
      <h3 className="font-serif text-3xl sm:text-4xl text-store-ink mb-3">
        Get 10% off your first order
      </h3>
      <p className="text-store-muted text-sm max-w-md mx-auto mb-8 leading-relaxed">
        New sofas, room looks and delivery tips for furnishing your Ghana home — straight to your inbox.
      </p>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          className="flex-1 rounded-full border border-stone-300 bg-white px-5 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-store-sage/25 focus:border-store-sage"
        />
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-full bg-store-sage px-7 py-3.5 text-sm font-medium text-white hover:bg-store-sageDark transition-colors disabled:opacity-60"
        >
          {isSubmitting ? 'Subscribing…' : 'Subscribe'}
        </button>
      </form>
      {submitStatus === 'success' && (
        <p className="mt-4 text-sm text-store-sage">You&apos;re on the list — thank you.</p>
      )}
      {submitStatus === 'error' && (
        <p className="mt-4 text-sm text-red-700">Something went wrong. Please try again.</p>
      )}
    </div>
  );
}
