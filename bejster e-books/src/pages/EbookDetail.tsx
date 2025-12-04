import { useParams, useNavigate } from 'react-router-dom';
import { useEbook } from '@/contexts/EbookContext';
import { useAuth } from '@/contexts/AuthContext';
import Sidebar from '@/components/Sidebar';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, ShoppingCart, Download, CreditCard } from 'lucide-react';
import { toast } from 'sonner';
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

const EbookDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getEbookById, purchaseEbook, purchasedEbooks } = useEbook();
  const { user } = useAuth();
  const [showPayment, setShowPayment] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'stripe' | 'paypal' | null>(null);
  const [processing, setProcessing] = useState(false);

  const ebook = getEbookById(id || '');
  const isPurchased = purchasedEbooks.some(e => e.id === id);
  const isOwner = ebook?.authorId === user?.id;

  if (!ebook) {
    return (
      <div className="flex min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <Sidebar />
        <div className="flex-1 p-8 flex items-center justify-center">
          <Card className="p-12 text-center">
            <p className="text-slate-600 mb-4">E-book not found</p>
            <Button onClick={() => navigate('/marketplace')}>
              Back to Marketplace
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  const handlePurchase = () => {
    if (isOwner) {
      toast.error("You can't purchase your own e-book");
      return;
    }
    if (isPurchased) {
      toast.error('You already own this e-book');
      return;
    }
    setShowPayment(true);
  };

  const handlePaymentConfirm = async () => {
    if (!paymentMethod) {
      toast.error('Please select a payment method');
      return;
    }

    setProcessing(true);
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const success = await purchaseEbook(ebook.id);
    
    if (success) {
      toast.success('Purchase successful! E-book added to your library');
      setShowPayment(false);
      navigate('/my-ebooks');
    } else {
      toast.error('Purchase failed. Please try again.');
    }
    
    setProcessing(false);
  };

  const handleDownload = () => {
    toast.success(`Downloading ${ebook.title}...`);
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Sidebar />
      <div className="flex-1 p-8">
        <div className="max-w-6xl mx-auto space-y-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/marketplace')}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Marketplace
          </Button>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <Card className="overflow-hidden shadow-2xl">
                <img 
                  src={ebook.coverImage} 
                  alt={ebook.title}
                  className="w-full h-auto object-cover"
                />
              </Card>
              
              {(isPurchased || isOwner) && (
                <Button 
                  onClick={handleDownload}
                  className="w-full bg-green-600 hover:bg-green-700"
                  size="lg"
                >
                  <Download className="w-5 h-5 mr-2" />
                  Download PDF
                </Button>
              )}
            </div>

            <div className="space-y-6">
              <div>
                <Badge className="mb-3">{ebook.category}</Badge>
                <h1 className="text-4xl font-bold text-slate-900 mb-2">{ebook.title}</h1>
                <p className="text-slate-600">by {ebook.authorName}</p>
              </div>

              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-bold text-blue-600">
                  ${ebook.price}
                </span>
                <span className="text-xl text-slate-500">{ebook.currency}</span>
              </div>

              <Card className="bg-slate-50 border-slate-200">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg mb-2">About this e-book</h3>
                  <p className="text-slate-700 leading-relaxed">{ebook.description}</p>
                </CardContent>
              </Card>

              <div className="flex items-center gap-4 text-sm text-slate-600">
                <div>
                  <span className="font-semibold">{ebook.downloads}</span> downloads
                </div>
                <div>•</div>
                <div>
                  Published {new Date(ebook.createdAt).toLocaleDateString()}
                </div>
              </div>

              {!isOwner && !isPurchased && (
                <Button 
                  onClick={handlePurchase}
                  size="lg"
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-lg py-6"
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Purchase E-book
                </Button>
              )}

              {isPurchased && (
                <Card className="bg-green-50 border-green-200">
                  <CardContent className="p-4 text-center">
                    <p className="text-green-700 font-semibold">✓ You own this e-book</p>
                  </CardContent>
                </Card>
              )}

              {isOwner && (
                <Card className="bg-blue-50 border-blue-200">
                  <CardContent className="p-4 text-center">
                    <p className="text-blue-700 font-semibold">This is your e-book</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>

      <Dialog open={showPayment} onOpenChange={setShowPayment}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Complete Purchase</DialogTitle>
            <DialogDescription>
              Choose your payment method to purchase {ebook.title}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="text-center mb-4">
              <p className="text-3xl font-bold text-slate-900">
                ${ebook.price} {ebook.currency}
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
              {processing ? 'Processing...' : 'Confirm Payment'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EbookDetail;