
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Brain, Workflow } from 'lucide-react';

const Hero = () => {
  return (
    <div className="relative bg-gradient-to-br from-jobmojo-light via-white to-white py-16 md:py-24">
      <div className="absolute inset-0 bg-grid-jobmojo opacity-10"></div>
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h1 className="text-3xl md:text-5xl font-heading font-bold mb-6">
            <span className="heading-gradient">The Only Enterprise Application</span> 
            <span className="block mt-2">You'll Ever Need</span>
          </h1>
          <p className="text-lg text-gray-700 mb-8">
            Revolutionize your business operations with AI-powered knowledge orchestration. 
            Streamline workflows, reduce cognitive load, and achieve unprecedented productivity across all departments.
          </p>
          
          <div className="bg-white p-6 rounded-xl shadow-lg mb-8">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
              <div className="md:col-span-5 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input 
                  placeholder="Search knowledge, workflows, or insights" 
                  className="pl-9 input-focus"
                />
              </div>
              <div className="md:col-span-4 relative">
                <Brain className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input 
                  placeholder="Department or function" 
                  className="pl-9 input-focus"
                />
              </div>
              <div className="md:col-span-3">
                <Button className="w-full bg-jobmojo-primary hover:bg-jobmojo-primary/90">
                  Start Trial
                </Button>
              </div>
            </div>
          </div>
          
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Button variant="outline" size="sm" className="rounded-full">
              <Workflow className="h-4 w-4 mr-1" />
              Workflow Automation
            </Button>
            <Button variant="outline" size="sm" className="rounded-full">
              Knowledge Management
            </Button>
            <Button variant="outline" size="sm" className="rounded-full">
              AI Analytics
            </Button>
            <Button variant="outline" size="sm" className="rounded-full">
              Cross-Department
            </Button>
            <Button variant="outline" size="sm" className="rounded-full">
              Cognitive Assistance
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="text-center p-6">
            <div className="w-16 h-16 bg-jobmojo-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Brain className="h-8 w-8 text-jobmojo-primary" />
            </div>
            <h3 className="font-heading font-semibold text-lg mb-2">Intelligent Knowledge Orchestration</h3>
            <p className="text-gray-600">AI-driven organization and retrieval of enterprise knowledge across all systems</p>
          </div>
          <div className="text-center p-6">
            <div className="w-16 h-16 bg-jobmojo-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Workflow className="h-8 w-8 text-jobmojo-secondary" />
            </div>
            <h3 className="font-heading font-semibold text-lg mb-2">Adaptive Workflow Automation</h3>
            <p className="text-gray-600">Streamline complex business processes with behavioral science integration</p>
          </div>
          <div className="text-center p-6">
            <div className="w-16 h-16 bg-jobmojo-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="h-8 w-8 text-jobmojo-accent" />
            </div>
            <h3 className="font-heading font-semibold text-lg mb-2">Cross-Domain Intelligence</h3>
            <p className="text-gray-600">Connect insights across departments for unprecedented operational efficiency</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
