import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar, 
  MapPin, 
  Download, 
  Share2, 
  QrCode, 
  Clock, 
  Users,
  CheckCircle,
  Home
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function Ticket() {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const { 
    bookingRef, 
    selectedSeats, 
    matchDetails, 
    totalPrice, 
    paymentMethod,
    bookingDate 
  } = location.state || {};

  if (!bookingRef || !selectedSeats || !matchDetails) {
    navigate('/');
    return null;
  }

  const downloadTicket = () => {
    toast({
      title: "Download Started",
      description: "Your ticket is being downloaded as PDF.",
    });
  };

  const shareTicket = () => {
    if (navigator.share) {
      navigator.share({
        title: `Cricket Ticket - ${matchDetails.title}`,
        text: `I'm going to watch ${matchDetails.title} at ${matchDetails.stadium}!`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link Copied",
        description: "Ticket link copied to clipboard.",
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Success Header */}
      <div className="text-center mb-8">
        <div className="mx-auto w-16 h-16 bg-primary rounded-full flex items-center justify-center mb-4">
          <CheckCircle className="h-8 w-8 text-primary-foreground" />
        </div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Booking Confirmed!</h1>
        <p className="text-muted-foreground">Your cricket match tickets have been successfully booked</p>
      </div>

      <div className="max-w-4xl mx-auto">
        {/* Digital Ticket */}
        <Card className="relative overflow-hidden shadow-ticket bg-gradient-to-br from-white to-primary/5 border border-primary/20">
          {/* Ticket Header */}
          <div className="bg-gradient-primary text-primary-foreground p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">CricketTix</h2>
                <p className="text-primary-foreground/80">Official Match Ticket</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-primary-foreground/80">Booking Reference</p>
                <p className="text-xl font-bold">{bookingRef}</p>
              </div>
            </div>
          </div>

          <CardContent className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Match Details */}
              <div className="lg:col-span-2 space-y-6">
                <div>
                  <h3 className="text-2xl font-bold text-foreground mb-2">
                    {matchDetails.title}
                  </h3>
                  <div className="flex items-center space-x-4 text-muted-foreground">
                    <Badge variant="outline" className="border-primary text-primary">
                      {matchDetails.teams[0]} vs {matchDetails.teams[1]}
                    </Badge>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex items-center text-foreground">
                      <Calendar className="h-5 w-5 mr-3 text-primary" />
                      <div>
                        <p className="font-medium">Match Date & Time</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(matchDetails.date).toLocaleDateString('en-US', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })} at {matchDetails.time}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center text-foreground">
                      <MapPin className="h-5 w-5 mr-3 text-primary" />
                      <div>
                        <p className="font-medium">Venue</p>
                        <p className="text-sm text-muted-foreground">
                          {matchDetails.stadium}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {matchDetails.city}, {matchDetails.country}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center text-foreground">
                      <Users className="h-5 w-5 mr-3 text-primary" />
                      <div>
                        <p className="font-medium">Seat Details</p>
                        {selectedSeats.map((seat: any, index: number) => (
                          <p key={seat.id} className="text-sm text-muted-foreground">
                            {seat.id} - {seat.type} (${seat.price})
                          </p>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center text-foreground">
                      <Clock className="h-5 w-5 mr-3 text-primary" />
                      <div>
                        <p className="font-medium">Booking Time</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(bookingDate).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Payment Summary */}
                <div className="bg-primary/5 rounded-lg p-4 border border-primary/20">
                  <h4 className="font-medium text-foreground mb-3">Payment Summary</h4>
                  <div className="space-y-2">
                    {selectedSeats.map((seat: any) => (
                      <div key={seat.id} className="flex justify-between text-sm">
                        <span>{seat.id} ({seat.type})</span>
                        <span>${seat.price}</span>
                      </div>
                    ))}
                    <div className="border-t border-primary/20 pt-2 flex justify-between font-semibold">
                      <span>Total Paid</span>
                      <span className="text-primary">${totalPrice}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Paid via {paymentMethod === 'card' ? 'Credit/Debit Card' : 'UPI'}
                    </p>
                  </div>
                </div>
              </div>

              {/* QR Code Section */}
              <div className="lg:col-span-1 flex flex-col items-center justify-center space-y-4 bg-primary/5 rounded-lg p-6 border border-primary/20">
                <div className="w-32 h-32 bg-white rounded-lg border-2 border-primary/20 flex items-center justify-center">
                  <QrCode className="h-16 w-16 text-primary" />
                </div>
                <div className="text-center">
                  <p className="font-medium text-foreground">Entry QR Code</p>
                  <p className="text-xs text-muted-foreground">
                    Show this at the stadium entrance
                  </p>
                </div>
              </div>
            </div>

            {/* Important Information */}
            <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <h4 className="font-medium text-yellow-800 mb-2">Important Information</h4>
              <ul className="text-sm text-yellow-700 space-y-1">
                <li>• Please arrive at the stadium at least 1 hour before match time</li>
                <li>• Carry a valid photo ID along with this ticket</li>
                <li>• Outside food and beverages are not allowed</li>
                <li>• This ticket is non-transferable and non-refundable</li>
                <li>• Keep this ticket safe as it will be required for entry</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mt-8 justify-center">
          <Button onClick={downloadTicket} size="lg" variant="default">
            <Download className="mr-2 h-4 w-4" />
            Download PDF
          </Button>
          <Button onClick={shareTicket} size="lg" variant="outline">
            <Share2 className="mr-2 h-4 w-4" />
            Share Ticket
          </Button>
          <Button onClick={() => navigate('/')} size="lg" variant="secondary">
            <Home className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
        </div>

        {/* Next Steps */}
        <Card className="mt-8">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">What's Next?</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-foreground mb-2">Before the Match</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Check weather conditions and dress accordingly</li>
                  <li>• Plan your route to the stadium</li>
                  <li>• Download the stadium app for updates</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-foreground mb-2">At the Stadium</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Show your QR code at the entrance</li>
                  <li>• Follow COVID-19 safety guidelines</li>
                  <li>• Enjoy the match and cheer responsibly!</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}