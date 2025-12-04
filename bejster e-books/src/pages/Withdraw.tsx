import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Sidebar from '@/components/Sidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DollarSign, CreditCard, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';

const Withdraw = () => {
  const { user, updateBalance } = useAuth();
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState('');
  const [loading, setLoading] = useState(false);

  const handleWithdraw = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const withdrawAmount = parseFloat(amount);
    
    if (!method) {
      toast.error('Please select a withdrawal method');
      return;
    }
    
    if (withdrawAmount <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }
    
    if (withdrawAmount > (user?.balance || 0)) {
      toast.error('Insufficient balance');
      return;
    }

    if (withdrawAmount < 10) {
      toast.error('Minimum withdrawal amount is $10');
      return;
    }

    setLoading(true);
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    updateBalance(-withdrawAmount);
    toast.success(`Successfully withdrew $${withdrawAmount.toFixed(2)} via ${method}`);
    setAmount('');
    setMethod('');
    
    setLoading(false);
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Sidebar />
      <div className="flex-1 p-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
              Withdraw Money
            </h1>
            <p className="text-slate-600">Transfer your earnings to your account</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <Card className="shadow-lg border-slate-200">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-slate-600">
                  Available Balance
                </CardTitle>
                <DollarSign className="w-5 h-5 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-slate-900">
                  ${user?.balance.toFixed(2)}
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-slate-200">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-slate-600">
                  Minimum Withdrawal
                </CardTitle>
                <TrendingUp className="w-5 h-5 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-slate-900">$10.00</div>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-slate-200">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-slate-600">
                  Processing Time
                </CardTitle>
                <CreditCard className="w-5 h-5 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-slate-900">1-3 days</div>
              </CardContent>
            </Card>
          </div>

          <Card className="shadow-lg border-slate-200">
            <CardHeader>
              <CardTitle>Withdrawal Request</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleWithdraw} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="amount">Amount (USD)</Label>
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    min="10"
                    max={user?.balance}
                    placeholder="Enter amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                  />
                  <p className="text-sm text-slate-500">
                    Minimum withdrawal: $10.00
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="method">Withdrawal Method</Label>
                  <Select value={method} onValueChange={setMethod}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select withdrawal method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="stripe">Stripe (Bank Transfer)</SelectItem>
                      <SelectItem value="paypal">PayPal</SelectItem>
                      <SelectItem value="bank">Direct Bank Transfer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                  disabled={loading || !user?.balance || user.balance < 10}
                >
                  {loading ? 'Processing...' : 'Request Withdrawal'}
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-6">
              <h3 className="font-semibold text-blue-900 mb-2">Important Information</h3>
              <ul className="space-y-2 text-sm text-blue-800">
                <li>• Withdrawals are processed within 1-3 business days</li>
                <li>• A 3% processing fee applies to all withdrawals</li>
                <li>• Minimum withdrawal amount is $10.00</li>
                <li>• You earn 70% commission on each e-book sale</li>
                <li>• Ensure your payment details are up to date in Settings</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Withdraw;