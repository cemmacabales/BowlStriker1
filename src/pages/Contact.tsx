import React, { useState } from 'react';
import { GlassCard } from '../components/GlassCard';
import { Instagram, Facebook, Phone, Mail, Send, CheckCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';

export function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [emailError, setEmailError] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return 'Please enter a valid email address (e.g. you@gmail.com).';
    }
    return '';
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    if (name === 'email') {
      setEmailError(value ? validateEmail(value) : '');
    }
  };

  const isFormValid =
    form.name.trim() !== '' &&
    form.email.trim() !== '' &&
    form.message.trim() !== '' &&
    validateEmail(form.email) === '';

  const handleSubmit = async (e: React.MouseEvent) => {
    e.preventDefault();
    const emailErr = validateEmail(form.email);
    if (emailErr) { setEmailError(emailErr); return; }
    if (!isFormValid) return;

    setLoading(true);
    setError('');

    try {
      const { error: insertError } = await supabase
        .from('contact_messages')
        .insert({
          name: form.name.trim(),
          email: form.email.trim(),
          message: form.message.trim(),
          read: false,
        });

      if (insertError) throw insertError;
      setSubmitted(true);
    } catch (err: any) {
      console.error(err);
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const contactItems = [
    {
      icon: <Instagram className="w-5 h-5" />,
      label: 'Instagram',
      value: '@bowlstriker',
      href: 'https://instagram.com/bowlstriker',
      color: 'from-pink-500 to-purple-500',
    },
    {
      icon: <Facebook className="w-5 h-5" />,
      label: 'Facebook',
      value: 'Bowl Striker Official',
      href: 'https://facebook.com/bowlstriker',
      color: 'from-blue-500 to-blue-400',
    },
    {
      icon: <Phone className="w-5 h-5" />,
      label: 'Phone',
      value: '+1 (555) 012-3456',
      href: 'tel:+15550123456',
      color: 'from-cyan-500 to-teal-400',
    },
    {
      icon: <Mail className="w-5 h-5" />,
      label: 'Email',
      value: 'support@bowlstriker.com',
      href: 'mailto:support@bowlstriker.com',
      color: 'from-purple-500 to-pink-400',
    },
  ];

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-14">
          <h1 className="text-4xl font-display font-bold mb-4">
            Contact <span className="text-gradient">Us</span>
          </h1>
          <p className="text-white/60 max-w-xl mx-auto">
            Have a question, feedback, or just want to talk bowling? We'd love to hear from you. Reach out through any of our channels below.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Left: Contact Info */}
          <div className="space-y-4">
            {contactItems.map((item) => (
              <a key={item.label} href={item.href} target="_blank" rel="noopener noreferrer" className="block group">
                <GlassCard hoverEffect className="flex items-center gap-5 px-6 py-5 cursor-pointer">
                  <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    {item.icon}
                  </div>
                  <div>
                    <p className="text-xs font-medium text-white/40 uppercase tracking-widest mb-0.5">{item.label}</p>
                    <p className="text-white font-medium group-hover:text-primary-cyan transition-colors duration-200">{item.value}</p>
                  </div>
                  <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity text-primary-cyan text-xs font-medium">Visit →</div>
                </GlassCard>
              </a>
            ))}
          </div>

          {/* Right: Send Message Form */}
          <GlassCard variant="dark" className="p-8">
            {submitted ? (
              <div className="flex flex-col items-center justify-center py-10 text-center gap-4">
                <CheckCircle className="w-14 h-14 text-primary-cyan" />
                <h3 className="text-2xl font-display font-bold">Message Sent!</h3>
                <p className="text-white/60 text-sm max-w-xs">Thanks for reaching out. We'll get back to you as soon as possible.</p>
                <button
                  onClick={() => { setSubmitted(false); setForm({ name: '', email: '', message: '' }); setEmailError(''); }}
                  className="mt-2 text-sm text-primary-cyan hover:underline"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <>
                <h2 className="text-xl font-display font-bold mb-6 flex items-center gap-2">
                  <Send className="w-5 h-5 text-primary-cyan" />
                  Send a Message
                </h2>

                <div className="space-y-5">
                  <div>
                    <label className="block text-xs font-medium text-white/40 uppercase tracking-widest mb-2">Full Name</label>
                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="Juan dela Cruz"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-primary-cyan transition-all duration-200 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-white/40 uppercase tracking-widest mb-2">Email Address</label>
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="you@gmail.com"
                      className={`w-full bg-white/5 border rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none transition-all duration-200 text-sm ${
                        emailError ? 'border-red-500/60 focus:border-red-500' : 'border-white/10 focus:border-primary-cyan'
                      }`}
                    />
                    {emailError && <p className="mt-1.5 text-xs text-red-400">{emailError}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-white/40 uppercase tracking-widest mb-2">Message</label>
                    <textarea
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      rows={5}
                      placeholder="Type your message here..."
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-primary-cyan transition-all duration-200 text-sm resize-none"
                    />
                  </div>

                  {error && <p className="text-xs text-red-400">{error}</p>}

                  <button
                    onClick={handleSubmit}
                    disabled={loading || !isFormValid}
                    className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-xl font-semibold text-sm transition-all duration-300 bg-gradient-to-r from-[#00D4FF] to-[#8B5CF6] text-white hover:opacity-90 hover:shadow-[0_0_24px_rgba(0,212,255,0.3)] disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    {loading ? <span className="animate-pulse">Sending...</span> : <><Send className="w-4 h-4" />Send Message</>}
                  </button>
                </div>
              </>
            )}
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
