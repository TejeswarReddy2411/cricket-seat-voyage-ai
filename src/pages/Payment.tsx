import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { CreditCard, Smartphone, Shield, ArrowLeft, Calendar, MapPin } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PaymentFormData {
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  cardholderName: string;
  email: string;
  phone: string;
  upiId: string;
}

export default function Payment() {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const { selectedSeats, matchDetails, totalPrice } = location.state || {};
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'upi'>('card');
  const [isProcessing, setIsProcessing] = useState(false);
  
  const [formData, setFormData] = useState<PaymentFormData>({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: '',
    email: '',
    phone: '',
    upiId: ''
  });

  if (!selectedSeats || !matchDetails) {
    navigate('/');
    return null;
  }

  const handleInputChange = (field: keyof PaymentFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCardNumber(e.target.value);
    if (formatted.length <= 19) {
      handleInputChange('cardNumber', formatted);
    }
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatExpiryDate(e.target.value);
    if (formatted.length <= 5) {
      handleInputChange('expiryDate', formatted);
    }
  };

  const processPayment = async () => {
    setIsProcessing(true);
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Generate booking reference
    const bookingRef = 'CT' + Date.now().toString(36).toUpperCase();
    
    toast({
      title: "Payment Successful!",
      description: `Your booking ${bookingRef} has been confirmed.`,
    });
    
    // Navigate to ticket page with booking details
    navigate('/ticket', {
      state: {
        bookingRef,
        selectedSeats,
        matchDetails,
        totalPrice,
        paymentMethod,
        bookingDate: new Date().toISOString()
      }
    });
  };

  const isFormValid = () => {
    if (paymentMethod === 'card') {
      return formData.cardNumber.replace(/\s/g, '').length === 16 &&
             formData.expiryDate.length === 5 &&
             formData.cvv.length >= 3 &&
             formData.cardholderName.trim().length > 0 &&
             formData.email.includes('@') &&
             formData.phone.length >= 10;
    } else {
      return formData.upiId.includes('@') &&
             formData.email.includes('@') &&
             formData.phone.length >= 10;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-6">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mr-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Seats
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Complete Payment</h1>
          <p className="text-muted-foreground">Secure payment for your cricket match tickets</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Payment Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Payment Method Selection */}
          <Card>
            <CardHeader>
              <CardTitle>Payment Method</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <Button
                  variant={paymentMethod === 'card' ? 'default' : 'outline'}
                  className="p-6 h-auto flex flex-col items-center"
                  onClick={() => setPaymentMethod('card')}
                >
                  <CreditCard className="h-8 w-8 mb-2" />
                  <span>Credit/Debit Card</span>
                </Button>
                <Button
                  variant={paymentMethod === 'upi' ? 'default' : 'outline'}
                  className="p-6 h-auto flex flex-col items-center"
                  onClick={() => setPaymentMethod('upi')}
                >
                  <Smartphone className="h-8 w-8 mb-2" />
                  <span>UPI Payment</span>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Payment Details */}
          <Card>
            <CardHeader>
              <CardTitle>
                {paymentMethod === 'card' ? 'Card Details' : 'UPI Details'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {paymentMethod === 'card' ? (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="cardNumber">Card Number</Label>
                    <Input
                      id="cardNumber"
                      placeholder="1234 5678 9012 3456"
                      value={formData.cardNumber}
                      onChange={handleCardNumberChange}
                      maxLength={19}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="expiryDate">Expiry Date</Label>
                      <Input
                        id="expiryDate"
                        placeholder="MM/YY"
                        value={formData.expiryDate}
                        onChange={handleExpiryChange}
                        maxLength={5}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cvv">CVV</Label>
                      <Input
                        id="cvv"
                        placeholder="123"
                        value={formData.cvv}
                        onChange={(e) => handleInputChange('cvv', e.target.value.replace(/\D/g, '').slice(0, 4))}
                        maxLength={4}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="cardholderName">Cardholder Name</Label>
                    <Input
                      id="cardholderName"
                      placeholder="John Doe"
                      value={formData.cardholderName}
                      onChange={(e) => handleInputChange('cardholderName', e.target.value)}
                    />
                  </div>
                </>
              ) : (
                <div className="space-y-2">
                  <Label htmlFor="upiId">UPI ID</Label>
                  <Input
                    id="upiId"
                    placeholder="yourname@paytm"
                    value={formData.upiId}
                    onChange={(e) => handleInputChange('upiId', e.target.value)}
                  />
                </div>
              )}
              
              {/* Contact Information */}
              <Separator />
              
              <div className="space-y-4">
                <h4 className="font-medium">Contact Information</h4>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    placeholder="+1 234 567 8900"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Security Notice */}
          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2 text-primary">
                <Shield className="h-5 w-5" />
                <span className="font-medium">Secure Payment</span>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                Your payment information is encrypted and secure. We never store your card details.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Match Details */}
              <div>
                <h4 className="font-medium">{matchDetails.title}</h4>
                <div className="text-sm text-muted-foreground space-y-1 mt-2">
                  <div className="flex items-center">
                    <Calendar className="h-3 w-3 mr-1" />
                    {new Date(matchDetails.date).toLocaleDateString()} at {matchDetails.time}
                  </div>
                  <div className="flex items-center">
                    <MapPin className="h-3 w-3 mr-1" />
                    {matchDetails.stadium}, {matchDetails.city}
                  </div>
                </div>
              </div>

              <Separator />

              {/* Selected Seats */}
              <div>
                <h4 className="font-medium mb-2">Selected Seats</h4>
                <div className="space-y-2">
                  {selectedSeats.map((seat: any) => (
                    <div key={seat.id} className="flex justify-between items-center text-sm">
                      <div>
                        <span>{seat.id}</span>
                        <Badge variant="outline" className="ml-2 text-xs">{seat.type}</Badge>
                      </div>
                      <span className="font-medium">${seat.price}</span>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Total */}
              <div className="flex justify-between items-center text-lg font-semibold">
                <span>Total Amount</span>
                <span className="text-primary">${totalPrice}</span>
              </div>

              {/* Pay Button */}
              <Button 
                className="w-full" 
                size="lg" 
                variant="hero"
                onClick={processPayment}
                disabled={!isFormValid() || isProcessing}
              >
                {isProcessing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <CreditCard className="mr-2 h-4 w-4" />
                    Pay ${totalPrice}
                  </>
                )}
              </Button>

              <p className="text-xs text-muted-foreground text-center">
                By proceeding, you agree to our Terms of Service and Privacy Policy
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}