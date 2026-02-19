import React, { useState } from 'react';
import { Plus, Minus } from 'lucide-react';
import { GlassCard } from '../components/GlassCard';
const faqs = [
{
  question: 'How do I choose the right weight for my bowling ball?',
  answer:
  "A general rule of thumb is to choose a ball that is approximately 10% of your body weight, up to 16 lbs. However, most adult men use 15-16 lbs, while most adult women use 12-14 lbs. It's best to go with the heaviest weight you can comfortably throw for consistent speed and control."
},
{
  question:
  'What is the difference between reactive and polyester coverstocks?',
  answer:
  'Polyester (plastic) balls are designed to go straight and are typically used for spares or by beginners. Reactive resin balls are designed to grip the lane and hook, providing more entry angle and pin carry for strikes. Our catalog features both types.'
},
{
  question: 'How long does shipping take?',
  answer:
  'Standard shipping typically takes 3-5 business days within the continental US. International shipping can take 7-14 days depending on the destination. Expedited options are available at checkout.'
},
{
  question: 'Do you offer drilling services?',
  answer:
  'Currently, we ship all balls undrilled. We recommend visiting your local pro shop to get your ball professionally measured and drilled specifically for your hand span and style.'
},
{
  question: 'What is your return policy?',
  answer:
  'We accept returns on undrilled, unused items within 30 days of purchase. Once a ball has been drilled, it cannot be returned unless there is a manufacturing defect.'
}];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  return (
    <div className="min-h-screen pt-24 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-display font-bold mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-white/60">
            Everything you need to know about our products and services.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) =>
          <GlassCard
            key={index}
            className={`overflow-hidden transition-all duration-300 ${openIndex === index ? 'bg-white/10' : ''}`}>

              <button
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
              className="w-full flex items-center justify-between p-6 text-left">

                <span className="font-bold text-lg pr-8">{faq.question}</span>
                {openIndex === index ?
              <Minus className="w-5 h-5 text-primary-cyan flex-shrink-0" /> :

              <Plus className="w-5 h-5 text-white/50 flex-shrink-0" />
              }
              </button>

              <div
              className={`px-6 text-white/70 overflow-hidden transition-all duration-300 ${openIndex === index ? 'max-h-48 pb-6 opacity-100' : 'max-h-0 opacity-0'}`}>

                {faq.answer}
              </div>
            </GlassCard>
          )}
        </div>
      </div>
    </div>);

}