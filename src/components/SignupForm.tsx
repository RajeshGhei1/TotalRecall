
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CheckCircle } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";

const SignupForm = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Enterprise trial initiated!",
        description: "Our team will contact you within 24 hours to set up your personalized demo.",
      });
      setEmail('');
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <section className="py-16 bg-jobmojo-light">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-heading font-semibold mb-4">
            Transform Your Enterprise Today
          </h2>
          <p className="text-gray-600 mb-8">
            Join the AI revolution in enterprise operations. Start your free trial and experience 
            unprecedented productivity gains with our cognitive assistance platform
          </p>
          
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <Input
              type="email"
              placeholder="Enter your business email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="input-focus"
            />
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="whitespace-nowrap"
            >
              {isSubmitting ? "Processing..." : "Start Enterprise Trial"}
            </Button>
          </form>
          
          <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4 sm:gap-8 text-sm text-gray-600">
            <div className="flex items-center justify-center">
              <CheckCircle className="h-4 w-4 mr-2 text-jobmojo-primary" />
              <span>AI-powered workflow automation</span>
            </div>
            <div className="flex items-center justify-center">
              <CheckCircle className="h-4 w-4 mr-2 text-jobmojo-primary" />
              <span>Cross-department integration</span>
            </div>
            <div className="flex items-center justify-center">
              <CheckCircle className="h-4 w-4 mr-2 text-jobmojo-primary" />
              <span>Dedicated success manager</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SignupForm;
