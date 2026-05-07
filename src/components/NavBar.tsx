
import { Coffee, LogOut, ShoppingCart, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface NavBarProps {
  cafeName?: string;
  isStaff: boolean;
  cartCount: number;
  onCartClick: () => void;
  onLogout: () => void;
  onLoginClick: () => void;
  onTitleClick: () => void;
}

export function NavBar({ 
  cafeName, 
  isStaff, 
  cartCount, 
  onCartClick, 
  onLogout, 
  onLoginClick,
  onTitleClick
}: NavBarProps) {
  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between mx-auto px-4">
        <div 
          className="flex items-center gap-2 cursor-pointer group"
          onClick={onTitleClick}
        >
          <div className="bg-primary p-1.5 rounded-lg text-primary-foreground group-hover:scale-110 transition-transform">
            <Coffee className="h-5 w-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold leading-none tracking-tight">
              {cafeName ? cafeName : "Smart Cafeteria"}
            </span>
            <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-medium">
              Digital Ordering
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {!isStaff && (
            <Button 
              variant="outline" 
              size="icon" 
              className="relative"
              onClick={onCartClick}
            >
              <ShoppingCart className="h-5 w-5" />
              {cartCount > 0 && (
                <Badge 
                  className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-[10px]"
                >
                  {cartCount}
                </Badge>
              )}
            </Button>
          )}

          {isStaff ? (
            <Button variant="ghost" size="sm" onClick={onLogout} className="text-destructive hover:text-destructive hover:bg-destructive/10">
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          ) : (
            <Button variant="ghost" size="icon" onClick={onLoginClick}>
              <User className="h-5 w-5" />
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
}
