
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Mail, Phone, User, MessageSquare } from 'lucide-react';

interface ContactFormProps {
  title?: string;
  showPhone?: boolean;
  submitButtonText?: string;
  onSubmit?: (data: any) => void;
  variant?: 'default' | 'compact' | 'detailed';
}

const ContactForm: React.FC<ContactFormProps> = ({
  title = 'Contact Us',
  showPhone = true,
  submitButtonText = 'Send Message',
  onSubmit,
  variant = 'default'
}) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    
    if (onSubmit) {
      onSubmit(formData);
    }
    
    // Reset form
    setFormData({ name: '', email: '', phone: '', message: '' });
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const isCompact = variant === 'compact';

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className={isCompact ? 'pb-4' : undefined}>
        <CardTitle className={`flex items-center gap-2 ${isCompact ? 'text-lg' : 'text-xl'}`}>
          <MessageSquare className="h-5 w-5" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Name
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="Your full name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Email
            </Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              placeholder="your@email.com"
              required
            />
          </div>

          {showPhone && (
            <div className="space-y-2">
              <Label htmlFor="phone" className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                Phone
              </Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                placeholder="Your phone number"
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="message">
              Message
            </Label>
            <Textarea
              id="message"
              value={formData.message}
              onChange={(e) => handleChange('message', e.target.value)}
              placeholder="Your message..."
              rows={isCompact ? 3 : 4}
              required
            />
          </div>

          <Button type="submit" className="w-full">
            {submitButtonText}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

// Module metadata for registration
(ContactForm as any).moduleMetadata = {
  id: 'contact-form',
  name: 'Contact Form',
  category: 'business',
  version: '1.0.0',
  description: 'A customizable contact form component',
  author: 'System',
  requiredPermissions: ['read', 'write'],
  props: {
    title: { type: 'string', default: 'Contact Us' },
    showPhone: { type: 'boolean', default: true },
    submitButtonText: { type: 'string', default: 'Send Message' },
    variant: { type: 'string', options: ['default', 'compact', 'detailed'], default: 'default' }
  }
};

export default ContactForm;
