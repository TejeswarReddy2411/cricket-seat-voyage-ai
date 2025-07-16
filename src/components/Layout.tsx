import { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Calendar, MapPin, Ticket, CreditCard, User } from 'lucide-react';
import cricketLogo from '@/assets/cricket-logo.jpg';

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();

  const navigation = [
    { name: 'Matches', href: '/', icon: Calendar },
    { name: 'Stadiums', href: '/stadiums', icon: MapPin },
    { name: 'My Tickets', href: '/tickets', icon: Ticket },
    { name: 'Profile', href: '/profile', icon: User },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-50 backdrop-blur-sm bg-card/95">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3">
              <img src={cricketLogo} alt="CricketTix" className="h-10 w-10 rounded-lg" />
              <div>
                <h1 className="text-xl font-bold text-foreground">CricketTix</h1>
                <p className="text-xs text-muted-foreground">Book Your Match</p>
              </div>
            </Link>

            {/* Navigation */}
            <nav className="hidden md:flex items-center space-x-1">
              {navigation.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.href;
                return (
                  <Link key={item.name} to={item.href}>
                    <Button 
                      variant={isActive ? "default" : "ghost"} 
                      className="flex items-center space-x-2"
                    >
                      <Icon className="h-4 w-4" />
                      <span>{item.name}</span>
                    </Button>
                  </Link>
                );
              })}
            </nav>

            {/* Mobile Navigation Button */}
            <Button variant="ghost" className="md:hidden">
              <span className="sr-only">Open menu</span>
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-card border-t border-border mt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-semibold text-foreground mb-4">CricketTix</h3>
              <p className="text-sm text-muted-foreground">
                Your trusted platform for booking cricket match tickets worldwide.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-foreground mb-4">Matches</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="/international" className="hover:text-primary">International</Link></li>
                <li><Link to="/ipl" className="hover:text-primary">IPL</Link></li>
                <li><Link to="/domestic" className="hover:text-primary">Domestic</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-foreground mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="/help" className="hover:text-primary">Help Center</Link></li>
                <li><Link to="/contact" className="hover:text-primary">Contact Us</Link></li>
                <li><Link to="/refund" className="hover:text-primary">Refund Policy</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-foreground mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="/privacy" className="hover:text-primary">Privacy Policy</Link></li>
                <li><Link to="/terms" className="hover:text-primary">Terms of Service</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border mt-8 pt-6 text-center text-sm text-muted-foreground">
            <p>&copy; 2024 CricketTix. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};