import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Sidebar from '@/components/Sidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Crown, Zap, CreditCard } from 'lucide-react';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

const Subscriptions = () => {
  const { user, updateSubscription } = useAuth();
  const [showPayment, setShowPayment] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<'basic' | 'premium' | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'stripe' | 'paypal' | null>(null);
  const [processing, setProcessing] = useState(false);

  const plans = [
    {
      id: 'free' as const,
      name: 'Free',
      price: 0,
      icon: Zap,
      features: [
        'Create 1 e-book',
        'Basic AI models',
        'Standard cover designs',
        'Community support'
      ],
      color: 'from-slate-500 to-slate-600'
    },
    {
      id: 'basic' as const,
      name: 'Basic',
      price: 5,
      icon: Check,
      features: [
        'Create 2 e-books',
        'Advanced AI models',
        'Premium cover designs',
        'Priority support',
        'Analytics dashboard'
      ],
      color: 'from-blue-500 to-blue-600',
      popular: true
    },
    {
      id: 'premium' as const,
      name: 'Premium',
      price: 15,
      icon: Crown,
      features: [
        'Unlimited e-books',
        'All AI models',
        'Custom cover designs',
        '24/7 priority support',
        'Advanced analytics',
        'Marketing tools',
        'Featured listings'
      ],
      color: 'from-purple-500 to-purple-600'
    }
  ];

  const handleSubscribe = (planId: 'basic' | 'premium') => {
    setSelectedPlan(planId);
    setShowPayment(true);
  };

  const handlePaymentConfirm = async () => {
    if (!paymentMethod || !selectedPlan) {
      toast.error('Please select a payment method');
      return;
    }

    setProcessing(true);
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    updateSubscription(selectedPlan);
    toast.success(`Successfully subscribed to ${selectedPlan} plan!`);
    setShowPayment(false);
    setSelectedPlan(null);
    setPaymentMethod(null);
    
    setProcessing(false);
  };

  const handleCancelSubscription = () => {
    updateSubscription('free');
    toast.success('Subscription cancelled successfully');
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Sidebar />
      <div className="flex-1 p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
              Subscription Plans
            </h1>
            <p className="text-slate-600">Choose the perfect plan for your publishing needs</p>
          </div>

          {user?.subscription !== 'free' && (
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-blue-900 mb-1">
                      Current Plan: {user?.subscription.charAt(0).toUpperCase() + user?.subscription.slice(1)}
                    </h3>
                    <p className="text-sm text-blue-700">
                      Your subscription will continue until you cancel it
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    onClick={handleCancelSubscription}
                    className="border-blue-300 text-blue-700 hover:bg-blue-100"
                  >
                    Cancel Subscription
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="grid md:grid-cols-3 gap-8">
            {plans.map((plan) => {
              const Icon = plan.icon;
              const isCurrentPlan = user?.subscription === plan.id;
              
              return (
                <Card 
                  key={plan.id}
                  className={`relative shadow-xl transition-all duration-300 hover:scale-105 ${
                    plan.popular ? 'border-2 border-blue-500' : 'border-slate-200'
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-1">
                        Most Popular
                      </Badge>
                    </div>
                  )}
                  
                  <CardHeader className="text-center pb-8 pt-6">
                    <div className={`mx-auto w-16 h-16 rounded-2xl bg-gradient-to-br ${plan.color} flex items-center justify-center mb-4`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <CardTitle className="text-2xl mb-2">{plan.name}</CardTitle>
                    <div className="text-4xl font-bold text-slate-900">
                      ${plan.price}
                      <span className="text-lg text-slate-500 font-normal">/month</span>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-6">
                    <ul className="space-y-3">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                          <span className="text-slate-700">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    
                    {isCurrentPlan ? (
                      <Button 
                        disabled
                        className="w-full bg-slate-300 text-slate-600 cursor-not-allowed"
                      >
                        Current Plan
                      </Button>
                    ) : plan.id === 'free' ? (
                      <Button 
                        variant="outline"
                        disabled={user?.subscription === 'free'}
                        onClick={handleCancelSubscription}
                        className="w-full"
                      >
                        {user?.subscription === 'free' ? 'Current Plan' : 'Downgrade'}
                      </Button>
                    ) : (
                      <Button 
                        onClick={() => handleSubscribe(plan.id)}
                        className={`w-full bg-gradient-to-r ${plan.color} hover:opacity-90`}
                      >
                        Subscribe Now
                      </Button>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <Card className="bg-amber-50 border-amber-200">
            <CardContent className="p-6">
              <h3 className="font-semibold text-amber-900 mb-2">Privacy Policy & Terms</h3>
              <ul className="space-y-2 text-sm text-amber-800">
                <li>• Subscriptions are billed monthly and renew automatically</li>
                <li>• Logging out does not cancel your subscription</li>
                <li>• No refunds are provided for partial months</li>
                <li>• You can cancel your subscription at any time from this page</li>
                <li>• After cancellation, you'll retain access until the end of your billing period</li>
                <li>• All payments are processed securely through Stripe or PayPal</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>

      <Dialog open={showPayment} onOpenChange={setShowPayment}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Complete Subscription</DialogTitle>
            <DialogDescription>
              Choose your payment method for the {selectedPlan} plan
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="text-center mb-4">
              <p className="text-3xl font-bold text-slate-900">
                ${selectedPlan === 'basic' ? '5' : '15'}/month
              </p>
            </div>
            
            <Button
              variant={paymentMethod === 'stripe' ? 'default' : 'outline'}
              className="w-full justify-start h-16"
              onClick={() => setPaymentMethod('stripe')}
            >
              <CreditCard className="w-6 h-6 mr-3" />
              <div className="text-left">
                <div className="font-semibold">Stripe</div>
                <div className="text-xs text-slate-500">Credit/Debit Card</div>
              </div>
            </Button>

            <Button
              variant={paymentMethod === 'paypal' ? 'default' : 'outline'}
              className="w-full justify-start h-16"
              onClick={() => setPaymentMethod('paypal')}
            >
              <div className="w-6 h-6 mr-3 bg-blue-600 rounded flex items-center justify-center text-white font-bold text-sm">
                P
              </div>
              <div className="text-left">
                <div className="font-semibold">PayPal</div>
                <div className="text-xs text-slate-500">Fast & Secure</div>
              </div>
            </Button>

            <Button
              onClick={handlePaymentConfirm}
              disabled={!paymentMethod || processing}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              size="lg"
            >
              {processing ? 'Processing...' : 'Confirm Subscription'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Subscriptions;