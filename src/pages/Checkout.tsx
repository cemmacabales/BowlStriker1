import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Check, CreditCard, Truck, ShieldCheck, AlertCircle } from 'lucide-react';
import { GlassCard } from '../components/GlassCard';
import { GradientButton } from '../components/GradientButton';
import { useCart } from '../context/CartContext';
import { useOrders } from '../context/OrderContext';
import { useAuth } from '../context/AuthContext';

const steps = [
  { id: 1, name: 'Shipping', icon: Truck },
  { id: 2, name: 'Payment', icon: CreditCard },
  { id: 3, name: 'Review', icon: ShieldCheck },
];

export function Checkout() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { items, cartTotal, clearCart } = useCart();
  const { addOrder } = useOrders();
  const { user, profile } = useAuth();

  const [shippingInfo, setShippingInfo] = useState({
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    zipCode: '',
    phone: '',
  });

  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: '',
    expiry: '',
    cvc: '',
  });

  const handleShippingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setShippingInfo({ ...shippingInfo, [e.target.name]: e.target.value });
  };

  const handleNext = () => {
    setError(null);
    if (currentStep === 1) {
      if (!shippingInfo.firstName || !shippingInfo.lastName || !shippingInfo.address || !shippingInfo.city || !shippingInfo.zipCode) {
        setError('Please fill in all shipping fields');
        return;
      }
    }
    if (currentStep === 2) {
      if (!paymentInfo.cardNumber || !paymentInfo.expiry || !paymentInfo.cvc) {
        setError('Please fill in all payment fields');
        return;
      }
    }
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      handlePlaceOrder();
    }
  };

  const handlePlaceOrder = async () => {
    if (!user) {
      setError('Please log in to place an order');
      return;
    }

    if (items.length === 0) {
      setError('Your cart is empty');
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const orderTotal = cartTotal * 1.08; // Including tax
      const fullName = `${shippingInfo.firstName} ${shippingInfo.lastName}`;
      const fullAddress = `${shippingInfo.address}, ${shippingInfo.city}, ${shippingInfo.zipCode}`;

      const order = await addOrder({
        customer_name: fullName,
        customer_email: user.email || profile?.email || '',
        customer_phone: shippingInfo.phone || undefined,
        shipping_address: fullAddress,
        items: items.map((item) => ({
          product_id: item.id,
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          image_url: item.image_url,
        })),
        total: orderTotal,
      });

      clearCart();
      navigate('/order-confirmation', { state: { orderId: order.id, order } });
    } catch (err) {
      console.error('Error placing order:', err);
      setError(err instanceof Error ? err.message : 'Failed to place order. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen pt-24 pb-20 px-4 flex items-center justify-center">
        <GlassCard className="max-w-md w-full p-12 text-center">
          <h2 className="text-2xl font-display font-bold mb-4">Please Log In</h2>
          <p className="text-white/60 mb-8">You need to be logged in to checkout.</p>
          <Link to="/login">
            <GradientButton>Log In</GradientButton>
          </Link>
        </GlassCard>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen pt-24 pb-20 px-4 flex items-center justify-center">
        <GlassCard className="max-w-md w-full p-12 text-center">
          <h2 className="text-2xl font-display font-bold mb-4">Cart is Empty</h2>
          <p className="text-white/60 mb-8">Add some items before checking out.</p>
          <Link to="/catalog">
            <GradientButton>Browse Catalog</GradientButton>
          </Link>
        </GlassCard>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Progress Steps */}
        <div className="mb-12">
          <div className="flex justify-between relative">
            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-white/10 -z-10" />
            {steps.map((step) => (
              <div
                key={step.id}
                className={`flex flex-col items-center gap-2 bg-[#0D0D0D] px-4 z-10 ${
                  currentStep >= step.id ? 'text-primary-cyan' : 'text-white/30'
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${
                    currentStep >= step.id
                      ? 'border-primary-cyan bg-primary-cyan/10 shadow-[0_0_15px_rgba(0,212,255,0.3)]'
                      : 'border-white/10 bg-[#0D0D0D]'
                  }`}
                >
                  {currentStep > step.id ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <step.icon className="w-5 h-5" />
                  )}
                </div>
                <span className="text-sm font-medium">{step.name}</span>
              </div>
            ))}
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/30 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Form Area */}
          <div className="lg:col-span-2">
            <GlassCard className="p-8">
              {currentStep === 1 && (
                <div className="space-y-6 animate-fade-in">
                  <h2 className="text-2xl font-bold mb-6">Shipping Information</h2>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm text-white/70">First Name *</label>
                      <input
                        type="text"
                        name="firstName"
                        value={shippingInfo.firstName}
                        onChange={handleShippingChange}
                        className="w-full bg-white/5 border border-white/10 rounded-lg p-3 focus:border-primary-cyan outline-none"
                        placeholder="John"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm text-white/70">Last Name *</label>
                      <input
                        type="text"
                        name="lastName"
                        value={shippingInfo.lastName}
                        onChange={handleShippingChange}
                        className="w-full bg-white/5 border border-white/10 rounded-lg p-3 focus:border-primary-cyan outline-none"
                        placeholder="Doe"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm text-white/70">Address *</label>
                    <input
                      type="text"
                      name="address"
                      value={shippingInfo.address}
                      onChange={handleShippingChange}
                      className="w-full bg-white/5 border border-white/10 rounded-lg p-3 focus:border-primary-cyan outline-none"
                      placeholder="123 Bowling Lane"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm text-white/70">City *</label>
                      <input
                        type="text"
                        name="city"
                        value={shippingInfo.city}
                        onChange={handleShippingChange}
                        className="w-full bg-white/5 border border-white/10 rounded-lg p-3 focus:border-primary-cyan outline-none"
                        placeholder="Strike City"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm text-white/70">Zip Code *</label>
                      <input
                        type="text"
                        name="zipCode"
                        value={shippingInfo.zipCode}
                        onChange={handleShippingChange}
                        className="w-full bg-white/5 border border-white/10 rounded-lg p-3 focus:border-primary-cyan outline-none"
                        placeholder="10300"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm text-white/70">Phone (optional)</label>
                    <input
                      type="text"
                      name="phone"
                      value={shippingInfo.phone}
                      onChange={handleShippingChange}
                      className="w-full bg-white/5 border border-white/10 rounded-lg p-3 focus:border-primary-cyan outline-none"
                      placeholder="+63 912 345 6789"
                    />
                  </div>
                </div>
              )}

              {currentStep === 2 && (
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
                        value={paymentInfo.cardNumber}
                        onChange={(e) => setPaymentInfo({ ...paymentInfo, cardNumber: e.target.value })}
                        className="w-full bg-black/20 border border-white/10 rounded-lg p-3 outline-none"
                        placeholder="0000 0000 0000 0000"
                      />
                      <div className="grid grid-cols-2 gap-4">
                        <input
                          type="text"
                          value={paymentInfo.expiry}
                          onChange={(e) => setPaymentInfo({ ...paymentInfo, expiry: e.target.value })}
                          className="w-full bg-black/20 border border-white/10 rounded-lg p-3 outline-none"
                          placeholder="MM/YY"
                        />
                        <input
                          type="text"
                          value={paymentInfo.cvc}
                          onChange={(e) => setPaymentInfo({ ...paymentInfo, cvc: e.target.value })}
                          className="w-full bg-black/20 border border-white/10 rounded-lg p-3 outline-none"
                          placeholder="CVC"
                        />
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-white/40 text-center">
                    This is a demo — no real payment is processed.
                  </p>
                </div>
              )}

              {currentStep === 3 && (
                <div className="space-y-6 animate-fade-in">
                  <h2 className="text-2xl font-bold mb-6">Review Order</h2>
                  
                  {/* Items */}
                  <div className="space-y-3 mb-6">
                    {items.map((item) => (
                      <div key={`${item.id}-${item.selectedSize}`} className="flex items-center gap-4 p-3 rounded-lg bg-white/5">
                        <img
                          src={item.image_url}
                          alt={item.name}
                          className="w-12 h-12 object-contain rounded"
                        />
                        <div className="flex-1">
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-white/50">Qty: {item.quantity} {item.selectedSize && `• ${item.selectedSize}`}</p>
                        </div>
                        <p className="font-bold">₱{(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between py-2 border-b border-white/10">
                      <span className="text-white/60">Shipping to</span>
                      <span className="text-right">
                        {shippingInfo.firstName} {shippingInfo.lastName}
                        <br />
                        {shippingInfo.address}, {shippingInfo.city}
                      </span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-white/10">
                      <span className="text-white/60">Payment Method</span>
                      <span>Card ending in {paymentInfo.cardNumber.slice(-4) || '****'}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-white/10">
                      <span className="text-white/60">Estimated Delivery</span>
                      <span>3-5 Business Days</span>
                    </div>
                  </div>
                </div>
              )}

              <div className="mt-8 flex justify-between">
                {currentStep > 1 ? (
                  <button
                    onClick={() => setCurrentStep(currentStep - 1)}
                    className="px-6 py-3 text-white/60 hover:text-white transition-colors"
                    disabled={isProcessing}
                  >
                    Back
                  </button>
                ) : (
                  <div />
                )}

                <GradientButton
                  onClick={handleNext}
                  disabled={isProcessing}
                  className="min-w-[150px]"
                >
                  {isProcessing ? 'Processing...' : currentStep === 3 ? 'Place Order' : 'Continue'}
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
                  <span>Subtotal ({items.length} items)</span>
                  <span>₱{cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-white/60">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
                <div className="flex justify-between text-white/60">
                  <span>Tax (8%)</span>
                  <span>₱{(cartTotal * 0.08).toFixed(2)}</span>
                </div>
              </div>
              <div className="pt-4 border-t border-white/10 flex justify-between font-bold text-lg">
                <span>Total</span>
                <span className="text-primary-cyan">
                  ₱{(cartTotal * 1.08).toFixed(2)}
                </span>
              </div>
            </GlassCard>
          </div>
        </div>
      </div>
    </div>
  );
}