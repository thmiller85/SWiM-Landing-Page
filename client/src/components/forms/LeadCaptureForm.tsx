import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X, Mail, User, Building, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';

const leadFormSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().optional(),
  email: z.string().email('Please enter a valid email address'),
  company: z.string().min(2, 'Company name is required'),
  industry: z.string().optional(),
  companySize: z.string().optional(),
  phone: z.string().optional(),
});

type LeadFormData = z.infer<typeof leadFormSchema>;

interface LeadCaptureFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: LeadFormData) => Promise<void>;
  title: string;
  description: string;
  ctaText: string;
  isSubmitting?: boolean;
}

const industries = [
  'Technology',
  'Healthcare',
  'Finance',
  'Manufacturing',
  'Retail',
  'Education',
  'Real Estate',
  'Consulting',
  'Marketing & Advertising',
  'Non-profit',
  'Other'
];

const companySizes = [
  '1-10 employees',
  '11-50 employees',
  '51-200 employees',
  '201-500 employees',
  '501-1000 employees',
  '1000+ employees'
];

export function LeadCaptureForm({
  isOpen,
  onClose,
  onSubmit,
  title,
  description,
  ctaText,
  isSubmitting = false
}: LeadCaptureFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch
  } = useForm<LeadFormData>({
    resolver: zodResolver(leadFormSchema)
  });

  const selectedIndustry = watch('industry');
  const selectedCompanySize = watch('companySize');

  const onFormSubmit = async (data: LeadFormData) => {
    try {
      await onSubmit(data);
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gray-900 border-gray-700 text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-center text-white">
            {title}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <p className="text-gray-300 text-center text-sm">
            {description}
          </p>

          <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
            {/* Name Fields */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="firstName" className="text-gray-300 text-sm">
                  First Name *
                </Label>
                <div className="relative">
                  <Input
                    id="firstName"
                    {...register('firstName')}
                    className="bg-gray-800 border-gray-600 text-white pl-10"
                    placeholder="John"
                  />
                  <User className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                </div>
                {errors.firstName && (
                  <p className="text-red-400 text-xs mt-1">{errors.firstName.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="lastName" className="text-gray-300 text-sm">
                  Last Name
                </Label>
                <Input
                  id="lastName"
                  {...register('lastName')}
                  className="bg-gray-800 border-gray-600 text-white"
                  placeholder="Doe"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <Label htmlFor="email" className="text-gray-300 text-sm">
                Business Email *
              </Label>
              <div className="relative">
                <Input
                  id="email"
                  type="email"
                  {...register('email')}
                  className="bg-gray-800 border-gray-600 text-white pl-10"
                  placeholder="john@company.com"
                />
                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              </div>
              {errors.email && (
                <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>
              )}
            </div>

            {/* Company */}
            <div>
              <Label htmlFor="company" className="text-gray-300 text-sm">
                Company Name *
              </Label>
              <div className="relative">
                <Input
                  id="company"
                  {...register('company')}
                  className="bg-gray-800 border-gray-600 text-white pl-10"
                  placeholder="Acme Corp"
                />
                <Building className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              </div>
              {errors.company && (
                <p className="text-red-400 text-xs mt-1">{errors.company.message}</p>
              )}
            </div>

            {/* Industry */}
            <div>
              <Label htmlFor="industry" className="text-gray-300 text-sm">
                Industry
              </Label>
              <Select onValueChange={(value) => setValue('industry', value)}>
                <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                  <SelectValue placeholder="Select your industry" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-600">
                  {industries.map((industry) => (
                    <SelectItem key={industry} value={industry} className="text-white hover:bg-gray-700">
                      {industry}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Company Size */}
            <div>
              <Label htmlFor="companySize" className="text-gray-300 text-sm">
                Company Size
              </Label>
              <Select onValueChange={(value) => setValue('companySize', value)}>
                <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                  <SelectValue placeholder="Select company size" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-600">
                  {companySizes.map((size) => (
                    <SelectItem key={size} value={size} className="text-white hover:bg-gray-700">
                      {size}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Phone (Optional) */}
            <div>
              <Label htmlFor="phone" className="text-gray-300 text-sm">
                Phone (Optional)
              </Label>
              <div className="relative">
                <Input
                  id="phone"
                  {...register('phone')}
                  className="bg-gray-800 border-gray-600 text-white pl-10"
                  placeholder="+1 (555) 123-4567"
                />
                <Phone className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3"
            >
              {isSubmitting ? 'Processing...' : ctaText}
            </Button>
          </form>

          {/* Privacy Note */}
          <p className="text-xs text-gray-400 text-center">
            We respect your privacy. Your information will only be used to send you the requested analysis and relevant business insights.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}