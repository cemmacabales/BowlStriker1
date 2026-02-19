import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, CreditCard, Truck, ShieldCheck } from 'lucide-react';
import { GlassCard } from '../components/GlassCard';
import { GradientButton } from '../components/GradientButton';
import { useCart } from '../context/CartContext';
const steps = [
{
  id: 1,
  name: 'Shipping',
  icon: Truck
},
{
  id: 2,
  name: 'Payment',
  icon: CreditCard
},
{
  id: 3,
  name: 'Review',
  icon: ShieldCheck
}];

export function Checkout() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();
  const { cartTotal, clearCart } = useCart();
  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      handlePlaceOrder();
    }
  };
  const handlePlaceOrder = () => {
    setIsProcessing(true);
    setTimeout(() => {
      clearCart();
      navigate('/order-confirmation');
    }, 2000);
  };
  return (
    <div className="min-h-screen pt-24 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Progress Steps */}
        <div className="mb-12">
          <div className="flex justify-between relative">
            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-white/10 -z-10" />
            {steps.map((step) =>
            <div
              key={step.id}
              className={`flex flex-col items-center gap-2 bg-[#0D0D0D] px-4 z-10 ${currentStep >= step.id ? 'text-primary-cyan' : 'text-white/30'}`}>

                <div
                className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${currentStep >= step.id ? 'border-primary-cyan bg-primary-cyan/10 shadow-[0_0_15px_rgba(0,212,255,0.3)]' : 'border-white/10 bg-[#0D0D0D]'}`}>

                  {currentStep > step.id ?
                <Check className="w-5 h-5" /> :

                <step.icon className="w-5 h-5" />
                }
                </div>
                <span className="text-sm font-medium">{step.name}</span>
              </div>
            )}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Form Area */}
          <div className="lg:col-span-2">
            <GlassCard className="p-8">
              {currentStep === 1 &&
              <div className="space-y-6 animate-fade-in">
                  <h2 className="text-2xl font-bold mb-6">
                    Shipping Information
                  </h2>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm text-white/70">
                        First Name
                      </label>
                      <input
                      type="text"
                      className="w-full bg-white/5 border border-white/10 rounded-lg p-3 focus:border-primary-cyan outline-none"
                      placeholder="John" />

                    </div>
                    <div className="space-y-2">
                      <label className="text-sm text-white/70">Last Name</label>
                      <input
                      type="text"
                      className="w-full bg-white/5 border border-white/10 rounded-lg p-3 focus:border-primary-cyan outline-none"
                      placeholder="Doe" />

                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm text-white/70">Address</label>
                    <input
                    type="text"
                    className="w-full bg-white/5 border border-white/10 rounded-lg p-3 focus:border-primary-cyan outline-none"
                    placeholder="123 Bowling Lane" />

                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm text-white/70">City</label>
                      <input
                      type="text"
                      className="w-full bg-white/5 border border-white/10 rounded-lg p-3 focus:border-primary-cyan outline-none"
                      placeholder="Strike City" />

                    </div>
                    <div className="space-y-2">
                      <label className="text-sm text-white/70">Zip Code</label>
                      <input
                      type="text"
                      className="w-full bg-white/5 border border-white/10 rounded-lg p-3 focus:border-primary-cyan outline-none"
                      placeholder="10300" />

                    </div>
                  </div>
                </div>
              }

              {currentStep === 2 &&
              <div className="space-y-6 animate-fade-in">
                  <h2 className="text-2xl font-bold mb-6">Payment Details</h2>
                  <div className="p-4 rounded-xl border border-primary-cyan/30 bg-primary-cyan/5 mb-6">
                    <div className="flex items-center justify-between mb-4">
                      <span className="font-bold">Credit Card</span>
                      <div className="flex gap-2">
                        <div className="w-8 h-5 bg-white/20 rounded" />
                        <div className="w-8 h-5 bg-white/20 rounded" />
                      </div>
                    </div>
                    <div className="space-y-4">
                      <input
                      type="text"
                      className="w-full bg-black/20 border border-white/10 rounded-lg p-3 outline-none"
                      placeholder="0000 0000 0000 0000" />

                      <div className="grid grid-cols-2 gap-4">
                        <input
                        type="text"
                        className="w-full bg-black/20 border border-white/10 rounded-lg p-3 outline-none"
                        placeholder="MM/YY" />

                        <input
                        type="text"
                        className="w-full bg-black/20 border border-white/10 rounded-lg p-3 outline-none"
                        placeholder="CVC" />

                      </div>
                    </div>
                  </div>
                </div>
              }

              {currentStep === 3 &&
              <div className="space-y-6 animate-fade-in">
                  <h2 className="text-2xl font-bold mb-6">Review Order</h2>
                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between py-2 border-b border-white/10">
                      <span className="text-white/60">Shipping to</span>
                      <span className="text-right">
                        John Doe
                        <br />
                        123 Bowling Lane
                      </span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-white/10">
                      <span className="text-white/60">Payment Method</span>
                      <span>Visa ending in 4242</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-white/10">
                      <span className="text-white/60">Estimated Delivery</span>
                      <span>3-5 Business Days</span>
                    </div>
                  </div>
                </div>
              }

              <div className="mt-8 flex justify-between">
                {currentStep > 1 ?
                <button
                  onClick={() => setCurrentStep(currentStep - 1)}
                  className="px-6 py-3 text-white/60 hover:text-white transition-colors">

                    Back
                  </button> :

                <div />
                }

                <GradientButton
                  onClick={handleNext}
                  isLoading={isProcessing}
                  className="min-w-[150px]">

                  {currentStep === 3 ? 'Place Order' : 'Continue'}
                </GradientButton>
              </div>
            </GlassCard>
          </div>

          {/* Sidebar Summary */}
          <div className="lg:col-span-1">
            <GlassCard className="p-6 sticky top-24">
              <h3 className="text-lg font-bold mb-4">Order Summary</h3>
              <div className="space-y-2 mb-4 text-sm">
                <div className="flex justify-between text-white/60">
                  <span>Subtotal</span>
                  <span>${cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-white/60">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
                <div className="flex justify-between text-white/60">
                  <span>Tax</span>
                  <span>${(cartTotal * 0.08).toFixed(2)}</span>
                </div>
              </div>
              <div className="pt-4 border-t border-white/10 flex justify-between font-bold text-lg">
                <span>Total</span>
                <span className="text-primary-cyan">
                  ${(cartTotal * 1.08).toFixed(2)}
                </span>
              </div>
            </GlassCard>
          </div>
        </div>
      </div>
    </div>);

}