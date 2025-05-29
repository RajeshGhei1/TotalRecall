
import { Database, Brain, TrendingUp } from 'lucide-react';

const steps = [
  {
    icon: <Database className="h-10 w-10 text-jobmojo-primary" />,
    title: "Knowledge Capture",
    description: "Automatically ingest and organize data from all your enterprise systems, documents, and workflows."
  },
  {
    icon: <Brain className="h-10 w-10 text-jobmojo-secondary" />,
    title: "AI Processing",
    description: "Our cognitive assistance engine analyzes patterns, identifies insights, and creates intelligent recommendations."
  },
  {
    icon: <TrendingUp className="h-10 w-10 text-jobmojo-accent" />,
    title: "Enterprise Insights",
    description: "Deliver actionable intelligence and automated workflows that transform your business operations."
  }
];

const HowItWorks = () => {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-heading font-semibold mb-4">How TOTAL RECALL Transforms Your Enterprise</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Our AI-powered platform revolutionizes knowledge management and operational efficiency, 
            reducing cognitive load while enabling unprecedented productivity across all departments
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
          <h3 className="text-2xl font-heading font-semibold mb-4">Ready to transform your enterprise operations?</h3>
          <p className="mb-6 text-white/90">
            Join industry leaders who have revolutionized their business with AI-driven cognitive assistance and workflow automation
          </p>
          <button className="bg-white text-jobmojo-primary hover:bg-jobmojo-light transition px-6 py-2.5 rounded-full font-medium">
            Start Enterprise Trial
          </button>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
