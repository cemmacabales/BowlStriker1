import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Check, CreditCard, Truck, ShieldCheck, AlertCircle, Loader2, CheckCircle, Banknote, Smartphone } from 'lucide-react';
import { GlassCard } from '../components/GlassCard';
import { GradientButton } from '../components/GradientButton';
import { useCart } from '../context/CartContext';
import { useOrders } from '../context/OrderContext';
import { useAuth } from '../context/AuthContext';

type CheckoutStep = 'shipping' | 'payment' | 'review' | 'processing' | 'success';

export function Checkout() {
  const navigate = useNavigate();
  const { items, cartTotal, clearCart } = useCart();
  const { addOrder } = useOrders();
  const { user, profile } = useAuth();

  const [currentStep, setCurrentStep] = useState<CheckoutStep>('shipping');
  const [error, setError] = useState<string | null>(null);
  const [createdOrderId, setCreatedOrderId] = useState<string | null>(null);

  const [shippingInfo, setShippingInfo] = useState({
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    zipCode: '',
    phone: '',
  });

  const [paymentMethod, setPaymentMethod] = useState('cash');

  // Redirect if not logged in
  if (!user) {
    return (
      <div className="min-h-screen pt-20 pb-20 px-4 flex items-center justify-center">
        <GlassCard className="p-8 max-w-md w-full text-center">
          <AlertCircle className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">Sign In Required</h2>
          <p className="text-white/60 mb-6">You need to sign in to checkout.</p>
          <Link to="/auth">
            <GradientButton className="w-full">Sign In</GradientButton>
          </Link>
        </GlassCard>
      </div>
    );
  }

  // Redirect if cart is empty (except on success)
  if (items.length === 0 && currentStep !== 'success') {
    return (
      <div className="min-h-screen pt-20 pb-20 px-4 flex items-center justify-center">
        <GlassCard className="p-8 max-w-md w-full text-center">
          <AlertCircle className="w-12 h-12 text-white/40 mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">Cart is empty</h2>
          <p className="text-white/60 mb-6">Add items to your cart before checking out.</p>
          <Link to="/catalog">
            <GradientButton className="w-full">Browse Products</GradientButton>
          </Link>
        </GlassCard>
      </div>
    );
  }

  const handlePlaceOrder = async () => {
    setCurrentStep('processing');
    setError(null);

    // Simulate payment processing delay
    await new Promise((resolve) => setTimeout(resolve, 2000));

    try {
      const orderData = {
        customer_name: `${shippingInfo.firstName} ${shippingInfo.lastName}`.trim() || user.email || 'Customer',
        customer_email: user.email || '',
        customer_phone: shippingInfo.phone,
        shipping_address: `${shippingInfo.address}, ${shippingInfo.city} ${shippingInfo.zipCode}`.trim(),
        items: items.map((item) => ({
          product_id: item.id,
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          image_url: item.image_url,
        })),
        total: cartTotal,
      };

      const order = await addOrder(orderData);

      if (order) {
        setCreatedOrderId(order.id);
        clearCart();
        setCurrentStep('success');
      } else {
        setError('Failed to create order. Please try again.');
        setCurrentStep('review');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
      setCurrentStep('review');
    }
  };

  const steps = [
    { id: 'shipping', name: 'Shipping', icon: Truck },
    { id: 'payment', name: 'Payment', icon: CreditCard },
    { id: 'review', name: 'Review', icon: ShieldCheck },
  ];

  const stepOrder: CheckoutStep[] = ['shipping', 'payment', 'review'];
  const currentStepIndex = stepOrder.indexOf(currentStep as any);

  const paymentMethods = [
    { id: 'cash', label: 'Cash on Delivery', icon: Banknote, description: 'Pay when your order arrives' },
    { id: 'gcash', label: 'GCash', icon: Smartphone, description: 'Pay via GCash e-wallet (dummy)' },
    { id: 'card', label: 'Credit/Debit Card', icon: CreditCard, description: 'Pay with card (dummy)' },
  ];

  // Processing screen
  if (currentStep === 'processing') {
    return (
      <div className="min-h-screen pt-20 pb-20 px-4 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-16 h-16 text-primary-cyan animate-spin mx-auto mb-6" />
          <h2 className="text-2xl font-bold mb-2">Processing Your Order</h2>
          <p className="text-white/60">Please wait while we confirm your payment...</p>
        </div>
      </div>
    );
  }

  // Success screen
  if (currentStep === 'success') {
    return (
      <div className="min-h-screen pt-20 pb-20 px-4 flex items-center justify-center">
        <div className="max-w-md w-full text-center">
          <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-green-400" />
          </div>
          <h2 className="text-3xl font-bold mb-2">Order Placed!</h2>
          <p className="text-white/60 mb-2">
            Your order has been successfully placed and is now being processed.
          </p>
          {createdOrderId && (
            <p className="text-sm text-white/40 mb-6 font-mono">
              Order ID: #{createdOrderId.substring(0, 8)}
            </p>
          )}
          <GlassCard className="p-6 mb-6 text-left">
            <h3 className="font-semibold mb-3 text-primary-cyan">What's Next?</h3>
            <ul className="space-y-2 text-sm text-white/60">
              <li>• Your order status is <span className="text-yellow-400 font-medium">Pending</span></li>
              <li>• You can track your order in Order History</li>
              <li>• The store will confirm and prepare your order shortly</li>
            </ul>
          </GlassCard>
          <div className="flex flex-col gap-3">
            <Link to="/order-history">
              <GradientButton className="w-full">View Order History</GradientButton>
            </Link>
            <Link
              to="/catalog"
              className="block w-full text-center py-3 text-white/60 hover:text-white transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 pb-20 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Step Indicator */}
        <div className="flex items-center justify-center mb-10">
          {steps.map((step, index) => (
            <React.Fragment key={step.id}>
              <div className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all ${index <= currentStepIndex
                      ? 'bg-gradient-to-r from-primary-cyan to-primary-blue text-white'
                      : 'bg-white/10 text-white/40'
                    }`}
                >
                  {index < currentStepIndex ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <step.icon className="w-5 h-5" />
                  )}
                </div>
                <span
                  className={`ml-2 text-sm font-medium hidden sm:inline ${index <= currentStepIndex ? 'text-white' : 'text-white/40'
                    }`}
                >
                  {step.name}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`w-12 h-px mx-3 ${index < currentStepIndex ? 'bg-primary-cyan' : 'bg-white/10'
                    }`}
                />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* STEP 1: Shipping */}
        {currentStep === 'shipping' && (
          <GlassCard className="p-6 animate-fade-in">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Truck className="w-5 h-5 text-primary-cyan" />
              Shipping Information
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm text-white/60 mb-1">First Name</label>
                <input
                  type="text"
                  value={shippingInfo.firstName}
                  onChange={(e) => setShippingInfo({ ...shippingInfo, firstName: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-4 text-white placeholder-white/30 focus:outline-none focus:border-primary-cyan/50 transition-all"
                  placeholder="Juan"
                />
              </div>
              <div>
                <label className="block text-sm text-white/60 mb-1">Last Name</label>
                <input
                  type="text"
                  value={shippingInfo.lastName}
                  onChange={(e) => setShippingInfo({ ...shippingInfo, lastName: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-4 text-white placeholder-white/30 focus:outline-none focus:border-primary-cyan/50 transition-all"
                  placeholder="Dela Cruz"
                />
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-sm text-white/60 mb-1">Address</label>
              <input
                type="text"
                value={shippingInfo.address}
                onChange={(e) => setShippingInfo({ ...shippingInfo, address: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-4 text-white placeholder-white/30 focus:outline-none focus:border-primary-cyan/50 transition-all"
                placeholder="123 Main Street"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm text-white/60 mb-1">City</label>
                <input
                  type="text"
                  value={shippingInfo.city}
                  onChange={(e) => setShippingInfo({ ...shippingInfo, city: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-4 text-white placeholder-white/30 focus:outline-none focus:border-primary-cyan/50 transition-all"
                  placeholder="Manila"
                />
              </div>
              <div>
                <label className="block text-sm text-white/60 mb-1">ZIP Code</label>
                <input
                  type="text"
                  value={shippingInfo.zipCode}
                  onChange={(e) => setShippingInfo({ ...shippingInfo, zipCode: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-4 text-white placeholder-white/30 focus:outline-none focus:border-primary-cyan/50 transition-all"
                  placeholder="1000"
                />
              </div>
            </div>
            <div className="mb-6">
              <label className="block text-sm text-white/60 mb-1">Phone</label>
              <input
                type="tel"
                value={shippingInfo.phone}
                onChange={(e) => setShippingInfo({ ...shippingInfo, phone: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-4 text-white placeholder-white/30 focus:outline-none focus:border-primary-cyan/50 transition-all"
                placeholder="09XX XXX XXXX"
              />
            </div>
            <GradientButton className="w-full" onClick={() => setCurrentStep('payment')}>
              Continue to Payment
            </GradientButton>
          </GlassCard>
        )}

        {/* STEP 2: Payment */}
        {currentStep === 'payment' && (
          <GlassCard className="p-6 animate-fade-in">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-primary-cyan" />
              Payment Method
            </h2>
            <div className="space-y-3 mb-6">
              {paymentMethods.map((method) => (
                <label
                  key={method.id}
                  className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all ${paymentMethod === method.id
                      ? 'border-primary-cyan bg-primary-cyan/10'
                      : 'border-white/10 hover:border-white/30'
                    }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value={method.id}
                    checked={paymentMethod === method.id}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="accent-cyan-400"
                  />
                  <div className={`p-2 rounded-lg ${paymentMethod === method.id ? 'bg-primary-cyan/20' : 'bg-white/10'}`}>
                    <method.icon className={`w-5 h-5 ${paymentMethod === method.id ? 'text-primary-cyan' : 'text-white/40'}`} />
                  </div>
                  <div>
                    <p className="font-medium">{method.label}</p>
                    <p className="text-sm text-white/40">{method.description}</p>
                  </div>
                </label>
              ))}
            </div>

            {/* Dummy Payment Forms */}
            {paymentMethod === 'gcash' && (
              <div className="bg-white/5 rounded-xl border border-white/10 p-4 mb-6">
                <p className="text-sm text-white/40 mb-3">This is a dummy payment. No real transaction will occur.</p>
                <input
                  type="tel"
                  placeholder="GCash Number (e.g., 09XX XXX XXXX)"
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-4 text-white placeholder-white/30 focus:outline-none focus:border-primary-cyan/50 transition-all"
                />
              </div>
            )}

            {paymentMethod === 'card' && (
              <div className="bg-white/5 rounded-xl border border-white/10 p-4 mb-6">
                <p className="text-sm text-white/40 mb-3">This is a dummy payment. No real transaction will occur.</p>
                <div className="space-y-3">
                  <input
                    type="text"
                    placeholder="Card Number (e.g., 4242 4242 4242 4242)"
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-4 text-white placeholder-white/30 focus:outline-none focus:border-primary-cyan/50 transition-all"
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="MM/YY"
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-4 text-white placeholder-white/30 focus:outline-none focus:border-primary-cyan/50 transition-all"
                    />
                    <input
                      type="text"
                      placeholder="CVC"
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-4 text-white placeholder-white/30 focus:outline-none focus:border-primary-cyan/50 transition-all"
                    />
                  </div>
                </div>
              </div>
            )}

            <div className="flex items-center justify-center gap-2 text-white/30 text-sm mb-6">
              <ShieldCheck className="w-4 h-4" />
              <span>Dummy payment — no real charges</span>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setCurrentStep('shipping')}
                className="flex-1 py-3 rounded-xl border border-white/10 text-white/60 hover:bg-white/5 transition-all"
              >
                Back
              </button>
              <GradientButton className="flex-[2]" onClick={() => setCurrentStep('review')}>
                Review Order
              </GradientButton>
            </div>
          </GlassCard>
        )}

        {/* STEP 3: Review */}
        {currentStep === 'review' && (
          <div className="space-y-6 animate-fade-in">
            {/* Order Summary */}
            <GlassCard className="p-6">
              <h2 className="text-xl font-bold mb-4">Order Summary</h2>
              <div className="space-y-3">
                {items.map((item) => (
                  <div key={`${item.id}-${item.selectedSize}`} className="flex items-center gap-4 py-2 border-b border-white/5 last:border-0">
                    {item.image_url && (
                      <img src={item.image_url} alt={item.name} className="w-12 h-12 rounded-lg object-cover" />
                    )}
                    <div className="flex-1">
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-white/40">
                        Qty: {item.quantity}
                        {item.selectedSize && ` • Size: ${item.selectedSize}`}
                      </p>
                    </div>
                    <p className="font-bold">₱{(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>
              <div className="border-t border-white/10 mt-4 pt-4">
                <div className="flex justify-between items-center text-sm text-white/60 mb-1">
                  <span>Subtotal</span>
                  <span>₱{cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center text-sm text-white/60 mb-2">
                  <span>Delivery Fee</span>
                  <span className="text-green-400">Free</span>
                </div>
                <div className="flex justify-between items-center text-lg font-bold">
                  <span>Total</span>
                  <span className="text-primary-cyan">₱{cartTotal.toFixed(2)}</span>
                </div>
              </div>
            </GlassCard>

            {/* Shipping Details */}
            <GlassCard className="p-6">
              <h2 className="text-lg font-bold mb-3">Shipping</h2>
              <p className="text-white/60 text-sm">
                {shippingInfo.firstName} {shippingInfo.lastName}
              </p>
              <p className="text-white/60 text-sm">{shippingInfo.address}</p>
              <p className="text-white/60 text-sm">{shippingInfo.city} {shippingInfo.zipCode}</p>
              {shippingInfo.phone && (
                <p className="text-white/60 text-sm">{shippingInfo.phone}</p>
              )}
            </GlassCard>

            {/* Payment */}
            <GlassCard className="p-6">
              <h2 className="text-lg font-bold mb-3">Payment</h2>
              <p className="text-white/60 text-sm capitalize">
                {paymentMethod === 'gcash' ? 'GCash' : paymentMethod === 'card' ? 'Credit/Debit Card' : 'Cash on Delivery'}
              </p>
            </GlassCard>

            {error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-red-400 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                {error}
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => setCurrentStep('payment')}
                className="flex-1 py-3 rounded-xl border border-white/10 text-white/60 hover:bg-white/5 transition-all"
              >
                Back
              </button>
              <GradientButton className="flex-[2]" onClick={handlePlaceOrder}>
                Place Order • ₱{cartTotal.toFixed(2)}
              </GradientButton>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}