
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
        title: "You're on the list!",
        description: "You'll receive job alerts straight to your inbox.",
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
            Never Miss an Opportunity
          </h2>
          <p className="text-gray-600 mb-8">
            Sign up for personalized job alerts and get the latest opportunities delivered straight to your inbox
          </p>
          
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <Input
              type="email"
              placeholder="Enter your email address"
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
              {isSubmitting ? "Signing up..." : "Get Job Alerts"}
            </Button>
          </form>
          
          <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4 sm:gap-8 text-sm text-gray-600">
            <div className="flex items-center justify-center">
              <CheckCircle className="h-4 w-4 mr-2 text-jobmojo-primary" />
              <span>Personalized job matches</span>
            </div>
            <div className="flex items-center justify-center">
              <CheckCircle className="h-4 w-4 mr-2 text-jobmojo-primary" />
              <span>Weekly career insights</span>
            </div>
            <div className="flex items-center justify-center">
              <CheckCircle className="h-4 w-4 mr-2 text-jobmojo-primary" />
              <span>Unsubscribe anytime</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SignupForm;
