import React, { useRef, useState } from 'react';
import {
  ChevronDown,
  Mail,
  Phone,
  MapPin,
  CheckCircle2,
  AlertCircle,
  LoaderCircle,
  Send,
} from 'lucide-react';
import { WhatsAppIcon } from './common/BrandIcons';
import Section from './common/Section';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

const SERVICES = [
  'New Project',
  'AI-Integrated App',
  '3D / Immersive Website',
  'E-Commerce Store',
  'SaaS Platform',
  'ERP Software',
  'Portfolio Website',
  'Business Website',
  'Showcase Website',
  'Bug Fix / Update',
  'Other',
];

const EMPTY = { name: '', email: '', service: 'New Project', message: '' };

const inputClass =
  'w-full rounded-xl border border-line bg-surface-2/60 px-4 py-3 text-sm text-ink-1 placeholder:text-ink-3/70 transition-colors focus:border-brand/50 focus:bg-surface-3/60 focus:outline-none';

const Contact = () => {
  const [formData, setFormData] = useState(EMPTY);
  const [status, setStatus] = useState('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const { ref: refForm, isVisible: formIn } = useScrollAnimation();
  const { ref: refInfo, isVisible: infoIn } = useScrollAnimation();

  // Simple spam mitigations: a field no human sees, and a floor on how fast the
  // form can be submitted after mount.
  const honeypotRef = useRef(null);
  const mountedAt = useRef(Date.now());
  const lastSubmit = useRef(0);

  const handleChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (status === 'submitting') return;

    // A bot that fills every field trips this; a human never sees it.
    if (honeypotRef.current?.value) return;

    const now = Date.now();
    if (now - mountedAt.current < 2500) return; // filled impossibly fast
    if (now - lastSubmit.current < 8000) {
      setStatus('error');
      setErrorMsg('Please wait a few seconds before sending again.');
      return;
    }

    lastSubmit.current = now;
    setStatus('submitting');
    setErrorMsg('');

    try {
      const res = await fetch('https://formsubmit.co/ajax/ushnardra9999@gmail.com', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          ...formData,
          _subject: `Fluidwebsoft enquiry — ${formData.service}`,
          _template: 'table',
        }),
      });

      if (!res.ok) throw new Error(`Request failed (${res.status})`);

      setStatus('success');
      setFormData(EMPTY);
      setTimeout(() => setStatus('idle'), 8000);
    } catch (err) {
      setStatus('error');
      setErrorMsg(
        'The form could not be delivered. Please message on WhatsApp or email directly — both reach me straight away.'
      );
    }
  };

  const channels = [
    {
      Icon: WhatsAppIcon,
      title: 'WhatsApp',
      accent: 'text-ok',
      href: 'https://wa.me/919330497299?text=Hi%20Fluidwebsoft!%20I%27m%20interested%20in%20discussing%20a%20project.',
      lines: ['+91 93304 97299'],
      note: 'Fastest route — usually answered same day.',
    },
    {
      Icon: Mail,
      title: 'Email',
      accent: 'text-brand',
      href: 'mailto:ushnardra9999@gmail.com',
      lines: ['ushnardra9999@gmail.com'],
      note: "Send project details and I'll reply with questions and next steps.",
    },
    {
      Icon: Phone,
      title: 'Phone',
      accent: 'text-brand-mid',
      href: 'tel:+919330497299',
      lines: ['+91 93304 97299'],
      note: 'Available 10:00–20:00 IST, Monday to Saturday.',
    },
    {
      Icon: MapPin,
      title: 'Based in',
      accent: 'text-brand-deep',
      lines: ['Kolkata, West Bengal, India'],
      note: 'Working remotely with clients worldwide.',
    },
  ];

  return (
    <Section
      id="contact"
      index="11"
      eyebrow="Contact"
      title="Start a conversation"
      subtitle="Tell me what you're trying to build. You'll get a reply within 24 hours, and a free discovery call if it looks like a fit."
    >
      <div className="grid items-start gap-10 lg:grid-cols-5">
        {/* --- Form ------------------------------------------------------- */}
        <form
          ref={refForm}
          onSubmit={handleSubmit}
          noValidate={false}
          className={`reveal surface p-6 md:p-8 lg:col-span-3 ${formIn ? 'is-in' : ''}`}
        >
          {/* Honeypot — hidden from sight and from assistive tech */}
          <input
            ref={honeypotRef}
            type="text"
            name="_honey"
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
            className="pointer-events-none absolute size-0 opacity-0"
          />

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="c-name" className="mb-2 block text-sm font-medium text-ink-2">
                Your name
              </label>
              <input
                id="c-name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                autoComplete="name"
                className={inputClass}
                placeholder="Jane Doe"
              />
            </div>
            <div>
              <label htmlFor="c-email" className="mb-2 block text-sm font-medium text-ink-2">
                Email address
              </label>
              <input
                id="c-email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                autoComplete="email"
                className={inputClass}
                placeholder="jane@company.com"
              />
            </div>
          </div>

          <div className="mt-5">
            <label htmlFor="c-service" className="mb-2 block text-sm font-medium text-ink-2">
              What do you need?
            </label>
            <div className="relative">
              <select
                id="c-service"
                name="service"
                value={formData.service}
                onChange={handleChange}
                className={`${inputClass} appearance-none pr-10`}
              >
                {SERVICES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={15}
                aria-hidden="true"
                className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-brand"
              />
            </div>
          </div>

          <div className="mt-5">
            <label htmlFor="c-message" className="mb-2 block text-sm font-medium text-ink-2">
              Project details
            </label>
            <textarea
              id="c-message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
              rows={5}
              className={`${inputClass} resize-none`}
              placeholder="What are you building, who is it for, and when do you need it live?"
            />
          </div>

          <button
            type="submit"
            disabled={status === 'submitting'}
            className="mt-7 inline-flex w-full items-center justify-center gap-2.5 rounded-full bg-ink-1 px-6 py-4 text-sm font-semibold text-surface-0 transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {status === 'submitting' ? (
              <>
                <LoaderCircle size={16} className="animate-rotate" aria-hidden="true" />
                Sending…
              </>
            ) : (
              <>
                <Send size={15} strokeWidth={2.1} aria-hidden="true" />
                Send enquiry
              </>
            )}
          </button>

          {/* Status is announced to screen readers, not just shown */}
          <div aria-live="polite" className="min-h-0">
            {status === 'success' && (
              <p className="mt-4 flex items-start gap-2.5 rounded-xl border border-ok/25 bg-ok/10 p-3.5 text-sm text-ok">
                <CheckCircle2 size={16} className="mt-px shrink-0" aria-hidden="true" />
                Sent. I'll reply within 24 hours — check your spam folder if you don't see it.
              </p>
            )}
            {status === 'error' && (
              <p className="mt-4 flex items-start gap-2.5 rounded-xl border border-red-500/25 bg-red-500/10 p-3.5 text-sm text-red-400">
                <AlertCircle size={16} className="mt-px shrink-0" aria-hidden="true" />
                {errorMsg}
              </p>
            )}
          </div>
        </form>

        {/* --- Channels --------------------------------------------------- */}
        <div
          ref={refInfo}
          className={`reveal space-y-3 lg:col-span-2 ${infoIn ? 'is-in' : ''}`}
          style={{ '--reveal-delay': '120ms' }}
        >
          {channels.map(({ Icon, title, accent, href, lines, note }) => {
            const inner = (
              <>
                <div className="flex items-center gap-3">
                  <Icon size={17} strokeWidth={1.9} className={accent} aria-hidden="true" />
                  <h3 className="text-sm font-semibold text-ink-1">{title}</h3>
                </div>
                <div className="mt-3 space-y-0.5">
                  {lines.map((l) => (
                    <p key={l} className="text-sm text-ink-2">
                      {l}
                    </p>
                  ))}
                </div>
                <p className="mt-2 text-xs leading-relaxed text-ink-3">{note}</p>
              </>
            );

            return href ? (
              <a
                key={title}
                href={href}
                {...(href.startsWith('http')
                  ? { target: '_blank', rel: 'noopener noreferrer' }
                  : {})}
                className="block rounded-2xl border border-line p-5 transition-colors hover:border-line-strong hover:bg-surface-2/50"
              >
                {inner}
              </a>
            ) : (
              <div key={title} className="rounded-2xl border border-line p-5">
                {inner}
              </div>
            );
          })}
        </div>
      </div>
    </Section>
  );
};

export default Contact;
