import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, Users, CreditCard, ArrowLeft } from 'lucide-react';

interface Seat {
  id: string;
  row: string;
  number: number;
  section: string;
  price: number;
  isAvailable: boolean;
  isSelected: boolean;
  type: 'premium' | 'standard' | 'economy';
}

interface MatchDetails {
  id: string;
  title: string;
  teams: [string, string];
  date: string;
  time: string;
  stadium: string;
  city: string;
  country: string;
}

const matchDetails: MatchDetails = {
  id: '1',
  title: 'India vs Australia',
  teams: ['India', 'Australia'],
  date: '2024-01-15',
  time: '14:30',
  stadium: 'Melbourne Cricket Ground',
  city: 'Melbourne',
  country: 'Australia',
};

// Generate stadium seating layout
const generateSeats = (): Seat[] => {
  const seats: Seat[] = [];
  const sections = ['A', 'B', 'C', 'D', 'E'];
  const seatTypes = ['premium', 'standard', 'economy'] as const;
  const prices = { premium: 500, standard: 250, economy: 100 };
  
  sections.forEach((section, sectionIndex) => {
    for (let row = 1; row <= 15; row++) {
      for (let seatNum = 1; seatNum <= 20; seatNum++) {
        const seatType = sectionIndex < 2 ? 'premium' : sectionIndex < 4 ? 'standard' : 'economy';
        const isAvailable = Math.random() > 0.3; // 70% availability
        
        seats.push({
          id: `${section}${row}-${seatNum}`,
          row: `${section}${row}`,
          number: seatNum,
          section,
          price: prices[seatType],
          isAvailable,
          isSelected: false,
          type: seatType
        });
      }
    }
  });
  
  return seats;
};

export default function SeatBooking() {
  const { matchId } = useParams();
  const navigate = useNavigate();
  const [seats, setSeats] = useState<Seat[]>([]);
  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);
  const [selectedSection, setSelectedSection] = useState<string>('A');

  useEffect(() => {
    setSeats(generateSeats());
  }, []);

  const handleSeatClick = (seatId: string) => {
    setSeats(prevSeats => {
      const updatedSeats = prevSeats.map(seat => {
        if (seat.id === seatId && seat.isAvailable) {
          const updatedSeat = { ...seat, isSelected: !seat.isSelected };
          
          if (updatedSeat.isSelected) {
            setSelectedSeats(prev => [...prev.filter(s => s.id !== seatId), updatedSeat]);
          } else {
            setSelectedSeats(prev => prev.filter(s => s.id !== seatId));
          }
          
          return updatedSeat;
        }
        return seat;
      });
      
      return updatedSeats;
    });
  };

  const getSeatColor = (seat: Seat) => {
    if (!seat.isAvailable) return 'bg-gray-400 cursor-not-allowed';
    if (seat.isSelected) return 'bg-primary hover:bg-primary/90';
    
    switch (seat.type) {
      case 'premium': return 'bg-yellow-500 hover:bg-yellow-600 cursor-pointer';
      case 'standard': return 'bg-blue-500 hover:bg-blue-600 cursor-pointer';
      case 'economy': return 'bg-green-500 hover:bg-green-600 cursor-pointer';
      default: return 'bg-gray-300 hover:bg-gray-400 cursor-pointer';
    }
  };

  const totalPrice = selectedSeats.reduce((total, seat) => total + seat.price, 0);
  const sections = ['A', 'B', 'C', 'D', 'E'];
  const filteredSeats = seats.filter(seat => seat.section === selectedSection);

  const proceedToPayment = () => {
    if (selectedSeats.length > 0) {
      navigate(`/match/${matchId}/payment`, { 
        state: { 
          selectedSeats, 
          matchDetails, 
          totalPrice 
        } 
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-6">
        <Button variant="ghost" onClick={() => navigate('/')} className="mr-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Matches
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Select Your Seats</h1>
          <p className="text-muted-foreground">Choose your preferred seats for the match</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Match Information */}
        <Card className="lg:col-span-3 mb-6">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>{matchDetails.title}</span>
              <Badge variant="outline">{matchDetails.teams[0]} vs {matchDetails.teams[1]}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2 text-primary" />
                {new Date(matchDetails.date).toLocaleDateString()} at {matchDetails.time}
              </div>
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-2 text-primary" />
                {matchDetails.stadium}, {matchDetails.city}
              </div>
              <div className="flex items-center">
                <Users className="h-4 w-4 mr-2 text-primary" />
                {selectedSeats.length} seat(s) selected
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stadium Layout */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Stadium Layout</CardTitle>
              <div className="flex gap-2 flex-wrap">
                {sections.map(section => (
                  <Button
                    key={section}
                    variant={selectedSection === section ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedSection(section)}
                  >
                    Section {section}
                  </Button>
                ))}
              </div>
            </CardHeader>
            <CardContent>
              {/* Stadium Field */}
              <div className="mb-6 p-4 bg-gradient-stadium rounded-lg text-center">
                <div className="h-20 bg-primary/20 rounded-lg flex items-center justify-center">
                  <span className="text-lg font-semibold text-primary">Cricket Field</span>
                </div>
              </div>

              {/* Seating Layout */}
              <div className="space-y-2">
                {Array.from(new Set(filteredSeats.map(seat => seat.row))).map(row => (
                  <div key={row} className="flex items-center gap-1">
                    <span className="text-xs font-medium w-8 text-muted-foreground">{row}</span>
                    <div className="flex gap-1 flex-wrap">
                      {filteredSeats
                        .filter(seat => seat.row === row)
                        .map(seat => (
                          <button
                            key={seat.id}
                            className={`w-6 h-6 text-xs rounded ${getSeatColor(seat)} transition-colors duration-200`}
                            onClick={() => handleSeatClick(seat.id)}
                            disabled={!seat.isAvailable}
                            title={`${seat.id} - $${seat.price} (${seat.type})`}
                          >
                            {seat.number}
                          </button>
                        ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Legend */}
              <div className="mt-6 grid grid-cols-2 gap-2 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-yellow-500 rounded"></div>
                  <span>Premium ($500)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-blue-500 rounded"></div>
                  <span>Standard ($250)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-green-500 rounded"></div>
                  <span>Economy ($100)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-gray-400 rounded"></div>
                  <span>Unavailable</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Booking Summary */}
        <div className="lg:col-span-1">
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle>Booking Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {selectedSeats.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  Select seats to see booking summary
                </p>
              ) : (
                <>
                  <div className="space-y-2">
                    {selectedSeats.map(seat => (
                      <div key={seat.id} className="flex justify-between items-center text-sm">
                        <span>{seat.id} ({seat.type})</span>
                        <span className="font-medium">${seat.price}</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center text-lg font-semibold">
                      <span>Total</span>
                      <span className="text-primary">${totalPrice}</span>
                    </div>
                  </div>

                  <Button 
                    className="w-full" 
                    size="lg" 
                    variant="hero"
                    onClick={proceedToPayment}
                  >
                    <CreditCard className="mr-2 h-4 w-4" />
                    Proceed to Payment
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}