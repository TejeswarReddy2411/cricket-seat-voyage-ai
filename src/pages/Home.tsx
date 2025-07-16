import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Calendar, MapPin, Trophy, Users, Search, Clock } from 'lucide-react';
import cricketStadium from '@/assets/cricket-stadium.jpg';

interface Match {
  id: string;
  title: string;
  type: 'international' | 'ipl' | 'domestic';
  teams: [string, string];
  date: string;
  time: string;
  stadium: string;
  city: string;
  country: string;
  price: {
    min: number;
    max: number;
  };
  availableSeats: number;
  format: string;
}

const matches: Match[] = [
  {
    id: '1',
    title: 'India vs Australia',
    type: 'international',
    teams: ['India', 'Australia'],
    date: '2024-01-15',
    time: '14:30',
    stadium: 'Melbourne Cricket Ground',
    city: 'Melbourne',
    country: 'Australia',
    price: { min: 50, max: 500 },
    availableSeats: 1250,
    format: 'Test Match'
  },
  {
    id: '2',
    title: 'Mumbai Indians vs Chennai Super Kings',
    type: 'ipl',
    teams: ['Mumbai Indians', 'Chennai Super Kings'],
    date: '2024-01-20',
    time: '19:30',
    stadium: 'Wankhede Stadium',
    city: 'Mumbai',
    country: 'India',
    price: { min: 25, max: 300 },
    availableSeats: 800,
    format: 'T20'
  },
  {
    id: '3',
    title: 'England vs South Africa',
    type: 'international',
    teams: ['England', 'South Africa'],
    date: '2024-01-25',
    time: '10:30',
    stadium: 'Lords Cricket Ground',
    city: 'London',
    country: 'England',
    price: { min: 40, max: 400 },
    availableSeats: 950,
    format: 'ODI'
  },
  {
    id: '4',
    title: 'Royal Challengers vs Delhi Capitals',
    type: 'ipl',
    teams: ['Royal Challengers Bangalore', 'Delhi Capitals'],
    date: '2024-01-18',
    time: '19:30',
    stadium: 'M. Chinnaswamy Stadium',
    city: 'Bangalore',
    country: 'India',
    price: { min: 30, max: 350 },
    availableSeats: 600,
    format: 'T20'
  },
  {
    id: '5',
    title: 'Karnataka vs Tamil Nadu',
    type: 'domestic',
    teams: ['Karnataka', 'Tamil Nadu'],
    date: '2024-01-22',
    time: '09:30',
    stadium: 'M. A. Chidambaram Stadium',
    city: 'Chennai',
    country: 'India',
    price: { min: 15, max: 100 },
    availableSeats: 2000,
    format: 'First Class'
  },
  {
    id: '6',
    title: 'Pakistan vs New Zealand',
    type: 'international',
    teams: ['Pakistan', 'New Zealand'],
    date: '2024-01-30',
    time: '15:00',
    stadium: 'National Stadium',
    city: 'Karachi',
    country: 'Pakistan',
    price: { min: 20, max: 200 },
    availableSeats: 1100,
    format: 'T20I'
  }
];

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');

  const filteredMatches = matches.filter(match => {
    const matchesSearch = match.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         match.stadium.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         match.city.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'all' || match.type === selectedType;
    return matchesSearch && matchesType;
  });

  const getMatchTypeColor = (type: string) => {
    switch (type) {
      case 'international': return 'bg-primary text-primary-foreground';
      case 'ipl': return 'bg-orange-500 text-white';
      case 'domestic': return 'bg-blue-500 text-white';
      default: return 'bg-secondary text-secondary-foreground';
    }
  };

  const getMatchTypeLabel = (type: string) => {
    switch (type) {
      case 'international': return 'International';
      case 'ipl': return 'IPL';
      case 'domestic': return 'Domestic';
      default: return type;
    }
  };

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <section 
        className="relative py-24 px-4 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${cricketStadium})` }}
      >
        <div className="absolute inset-0 bg-black/60"></div>
        <div className="relative container mx-auto text-center text-white">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Book Your Cricket
            <span className="block text-primary-glow">Experience</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto opacity-90">
            From international showdowns to IPL excitement and domestic cricket - 
            secure your seats to the best matches worldwide
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="hero" className="text-lg px-8 py-4">
              <Calendar className="mr-2 h-5 w-5" />
              Browse Matches
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 py-4 bg-white/10 border-white/30 text-white hover:bg-white/20">
              <MapPin className="mr-2 h-5 w-5" />
              Find Stadiums
            </Button>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4">
        {/* Search and Filter Section */}
        <section className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search matches, stadiums, or cities..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Button 
                variant={selectedType === 'all' ? 'default' : 'outline'}
                onClick={() => setSelectedType('all')}
              >
                All Matches
              </Button>
              <Button 
                variant={selectedType === 'international' ? 'default' : 'outline'}
                onClick={() => setSelectedType('international')}
              >
                International
              </Button>
              <Button 
                variant={selectedType === 'ipl' ? 'default' : 'outline'}
                onClick={() => setSelectedType('ipl')}
              >
                IPL
              </Button>
              <Button 
                variant={selectedType === 'domestic' ? 'default' : 'outline'}
                onClick={() => setSelectedType('domestic')}
              >
                Domestic
              </Button>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <Card className="text-center">
            <CardContent className="pt-6">
              <Trophy className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-foreground">150+</h3>
              <p className="text-muted-foreground">Upcoming Matches</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <MapPin className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-foreground">50+</h3>
              <p className="text-muted-foreground">World-Class Stadiums</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <Users className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-foreground">1M+</h3>
              <p className="text-muted-foreground">Happy Customers</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <Clock className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-foreground">24/7</h3>
              <p className="text-muted-foreground">Customer Support</p>
            </CardContent>
          </Card>
        </section>

        {/* Matches Grid */}
        <section>
          <h2 className="text-3xl font-bold text-foreground mb-6">Upcoming Matches</h2>
          {filteredMatches.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">No matches found matching your criteria.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMatches.map((match) => (
                <Card key={match.id} className="hover:shadow-stadium transition-shadow duration-300">
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <Badge className={getMatchTypeColor(match.type)}>
                        {getMatchTypeLabel(match.type)}
                      </Badge>
                      <Badge variant="outline">{match.format}</Badge>
                    </div>
                    <CardTitle className="text-lg">{match.title}</CardTitle>
                    <CardDescription>
                      {match.teams[0]} vs {match.teams[1]}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4 mr-2" />
                      {new Date(match.date).toLocaleDateString()} at {match.time}
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4 mr-2" />
                      {match.stadium}, {match.city}
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Starting from</p>
                        <p className="text-lg font-semibold text-primary">${match.price.min}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">Available</p>
                        <p className="text-sm font-medium">{match.availableSeats} seats</p>
                      </div>
                    </div>
                    <Link to={`/match/${match.id}/seats`}>
                      <Button className="w-full" variant="hero">
                        Book Tickets
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}