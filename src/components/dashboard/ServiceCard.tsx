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
      <Card className={`service-card h-full cursor-pointer bg-gradient-to-br ${gradient} backdrop-blur-xl border border-white/10 hover:border-primary/50 shadow-2xl hover:shadow-primary/20 transition-all duration-300`}>
        <CardContent className="p-8 h-full flex flex-col">
          <div className="flex items-center space-x-4 mb-6">
            <div className="text-6xl drop-shadow-lg">{icon}</div>
            <h3 className="text-3xl kalam-bold text-white drop-shadow-lg">{title}</h3>
          </div>
          
          <p className="text-white/80 mb-8 flex-grow text-lg kalam-light leading-relaxed">
            {description}
          </p>
          
          <Button
            onClick={onClick}
            className="w-full bg-gradient-to-r from-white/20 to-white/10 hover:from-white/30 hover:to-white/20 text-white border border-white/30 hover:border-white/50 kalam-regular font-semibold py-4 text-lg rounded-2xl transition-all duration-300 backdrop-blur-sm shadow-lg hover:shadow-xl"
          >
            Start {title}
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ServiceCard;