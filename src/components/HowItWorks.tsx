
import { Search, Sparkles, Clock } from 'lucide-react';

const steps = [
  {
    icon: <Search className="h-10 w-10 text-jobmojo-primary" />,
    title: "Search & Filter",
    description: "Browse thousands of curated jobs matching your skills and preferences."
  },
  {
    icon: <Sparkles className="h-10 w-10 text-jobmojo-secondary" />,
    title: "AI Matching",
    description: "Our AI analyzes your profile to find the perfect job matches for your career goals."
  },
  {
    icon: <Clock className="h-10 w-10 text-jobmojo-accent" />,
    title: "Apply & Track",
    description: "Apply with one click and track your application status in real-time."
  }
];

const HowItWorks = () => {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-heading font-semibold mb-4">How JobMojo Works</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Our AI-powered platform simplifies your job search and matches you with opportunities that align with your skills and career goals
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {steps.map((step, index) => (
            <div key={index} className="flex flex-col items-center text-center p-6 rounded-xl bg-white border border-gray-100 shadow-sm">
              <div className="mb-4 p-3 rounded-full bg-jobmojo-light">
                {step.icon}
              </div>
              <h3 className="text-xl font-heading font-semibold mb-3">{step.title}</h3>
              <p className="text-gray-600">{step.description}</p>
            </div>
          ))}
        </div>
        
        <div className="mt-16 max-w-4xl mx-auto bg-gradient-to-r from-jobmojo-primary to-jobmojo-secondary rounded-xl p-8 text-white text-center">
          <h3 className="text-2xl font-heading font-semibold mb-4">Ready to find your dream job?</h3>
          <p className="mb-6 text-white/90">
            Create your profile now and let our AI matching technology find the perfect opportunities for you
          </p>
          <button className="bg-white text-jobmojo-primary hover:bg-jobmojo-light transition px-6 py-2.5 rounded-full font-medium">
            Create Your Profile
          </button>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
