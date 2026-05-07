
import * as React from 'react';
import { MenuItem } from '../types';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface MenuCardProps {
  key?: React.Key;
  item: MenuItem;
  onAddToCart: (item: MenuItem) => void;
}

export function MenuCard({ item, onAddToCart }: MenuCardProps) {
  return (
    <Card className="overflow-hidden h-full flex flex-col group border-none shadow-sm hover:shadow-md transition-shadow">
      <div className="aspect-[4/3] overflow-hidden relative">
        <img 
          src={item.image} 
          alt={item.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute top-2 right-2">
          <div className="bg-background/90 backdrop-blur px-2 py-1 rounded-md text-xs font-bold shadow-sm">
            {item.price} ETB
          </div>
        </div>
      </div>
      <CardContent className="p-4 flex-grow">
        <h4 className="font-bold text-base leading-none">{item.name}</h4>
        <p className="text-xs text-muted-foreground mt-2 line-clamp-2">
          {item.description}
        </p>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button 
          className="w-full h-9 text-xs" 
          variant="secondary"
          onClick={() => onAddToCart(item)}
        >
          <Plus className="h-3 w-3 mr-1" />
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
}
