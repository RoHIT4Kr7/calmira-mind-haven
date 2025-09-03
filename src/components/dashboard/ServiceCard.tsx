import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface ServiceCardProps {
  id: string;
  title: string;
  description: string;
  icon: string;
  gradient: string;
  onClick: () => void;
}

const ServiceCard: React.FC<ServiceCardProps> = ({
  title,
  description,
  icon,
  gradient,
  onClick
}) => {
  return (
    <motion.div
      whileHover={{ y: -8 }}
      whileTap={{ scale: 0.98 }}
      className="h-full"
    >
      <Card className={`service-card h-full cursor-pointer bg-gradient-card backdrop-blur-sm border border-border hover:border-primary/30 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1`}>
        <CardContent className="p-8 h-full flex flex-col">
          <div className="flex items-center space-x-4 mb-6">
            <div className="text-6xl">{icon}</div>
            <h3 className="text-3xl poppins-semibold text-foreground">{title}</h3>
          </div>
          
          <p className="text-muted-foreground mb-8 flex-grow text-lg inter-regular leading-relaxed">
            {description}
          </p>
          
          <Button
            onClick={onClick}
            className="w-full bg-gradient-to-r from-primary to-primary-dark hover:from-primary-dark hover:to-primary text-white inter-medium font-medium py-4 text-lg rounded-xl transition-all duration-300 shadow-md hover:shadow-lg"
          >
            Start {title}
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ServiceCard;