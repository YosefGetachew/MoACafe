
import * as React from 'react';
import { Cafeteria } from '../types';
import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'motion/react';

interface CafeteriaCardProps {
  key?: React.Key;
  cafeteria: Cafeteria;
  isSelected: boolean;
  onClick: () => void;
}

export function CafeteriaCard({ cafeteria, isSelected, onClick }: CafeteriaCardProps) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.98 }}
    >
      <Card 
        className={`cursor-pointer transition-all duration-300 overflow-hidden border-2 h-full ${
          isSelected 
          ? "border-primary ring-2 ring-primary/20 shadow-lg" 
          : "border-transparent hover:border-border hover:shadow-md"
        }`}
        onClick={onClick}
      >
        <CardContent className="p-0 flex flex-col items-center text-center">
          <div className="w-full h-32 relative overflow-hidden bg-muted">
            <img 
              src={cafeteria.hero} 
              alt={cafeteria.name}
              className="w-full h-full object-cover transform transition-transform duration-700 hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent flex items-end justify-center p-4">
               <img 
                src={cafeteria.logo} 
                className="w-16 h-16 rounded-full border-4 border-background bg-background p-1"
               />
            </div>
          </div>
          <div className="p-4 pt-2">
            <h3 className="text-xl font-bold">{cafeteria.name}</h3>
            <p className="text-xs text-muted-foreground mt-1 line-clamp-2 leading-relaxed">
              {cafeteria.description}
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
