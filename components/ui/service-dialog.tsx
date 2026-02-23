import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Star, Users, Check } from 'lucide-react';
import Link from 'next/link';

export interface ServiceDetails {
  id: number;
  title: string;
  description: string;
  features: string[];
  extendedDescription?: string[];
  requirements?: string[];
  duration?: string;
  rating: number;
  students: number;
  icon: React.ReactNode;
  image: string;
}

interface ServiceDialogProps {
  service: ServiceDetails;
  isOpen: boolean;
  onClose: () => void;
}

export function ServiceDialog({ service, isOpen, onClose }: ServiceDialogProps) {
  // Function to smooth scroll to the application form section
  const scrollToApplicationForm = () => {
    onClose();
    setTimeout(() => {
      const applicationForm = document.getElementById('apply-now');
      if (applicationForm) {
        applicationForm.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md md:max-w-2xl w-[90vw] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="w-full h-48 relative mb-4 rounded-lg overflow-hidden">
            <img
              src={service.image || '/placeholder.svg'}
              alt={service.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-black/70 to-transparent"></div>
            <div className="absolute bottom-4 left-4 flex items-center gap-2">
              <div className="p-2 rounded-lg bg-background/90 shadow-md">
                {service.icon}
              </div>
            </div>
          </div>
          <DialogTitle className="text-2xl font-bold">{service.title}</DialogTitle>
          <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
            <div className="flex items-center">
              <Star className="h-4 w-4 text-yellow-500 mr-1" />
              {service.rating}
            </div>
            <div className="flex items-center">
              <Users className="h-4 w-4 mr-1" />
              {service.students}+ students
            </div>
            {service.duration && (
              <div className="flex items-center">
                <span className="text-sm">{service.duration}</span>
              </div>
            )}
          </div>
          <DialogDescription className="text-base mt-2">
            {service.description}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 my-4">
          <div>
            <h3 className="text-lg font-semibold mb-2">Program Features</h3>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {service.features.map((feature, index) => (
                <li key={index} className="flex items-center text-sm">
                  <Check className="h-4 w-4 text-primary mr-2" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>

          {service.extendedDescription && (
            <div>
              <h3 className="text-lg font-semibold mb-2">Program Details</h3>
              {service.extendedDescription.map((paragraph, index) => (
                <p key={index} className="text-sm text-muted-foreground mb-2">
                  {paragraph}
                </p>
              ))}
            </div>
          )}

          {service.requirements && (
            <div>
              <h3 className="text-lg font-semibold mb-2">Requirements</h3>
              <ul className="space-y-2">
                {service.requirements.map((requirement, index) => (
                  <li key={index} className="flex items-start text-sm">
                    <div className="min-w-[20px] mt-1">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                    </div>
                    <span>{requirement}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          <Button variant="outline" className="w-full sm:w-auto" onClick={onClose}>
            Close
          </Button>
          <Button 
            className="w-full sm:w-auto bg-primary hover:bg-primary/90"
            onClick={scrollToApplicationForm}
          >
            Apply Now
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}