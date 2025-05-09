
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, MapPin, Briefcase } from 'lucide-react';

const Hero = () => {
  return (
    <div className="relative bg-gradient-to-br from-jobmojo-light via-white to-white py-16 md:py-24">
      <div className="absolute inset-0 bg-grid-jobmojo opacity-10"></div>
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h1 className="text-3xl md:text-5xl font-heading font-bold mb-6">
            <span className="heading-gradient">AI-Powered Job Search</span> 
            <span className="block mt-2">for the Future of Work</span>
          </h1>
          <p className="text-lg text-gray-700 mb-8">
            Find your dream job with our AI matching technology that connects you with opportunities perfectly aligned to your skills and aspirations.
          </p>
          
          <div className="bg-white p-4 rounded-xl shadow-lg">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
              <div className="md:col-span-5 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input 
                  placeholder="Job title, keyword or company" 
                  className="pl-9 input-focus"
                />
              </div>
              <div className="md:col-span-4 relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input 
                  placeholder="Location" 
                  className="pl-9 input-focus"
                />
              </div>
              <div className="md:col-span-3">
                <Button className="w-full bg-jobmojo-primary hover:bg-jobmojo-primary/90">
                  Find Jobs
                </Button>
              </div>
            </div>
          </div>
          
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Button variant="outline" size="sm" className="rounded-full">
              <Briefcase className="h-4 w-4 mr-1" />
              Remote
            </Button>
            <Button variant="outline" size="sm" className="rounded-full">
              Software Development
            </Button>
            <Button variant="outline" size="sm" className="rounded-full">
              Marketing
            </Button>
            <Button variant="outline" size="sm" className="rounded-full">
              Design
            </Button>
            <Button variant="outline" size="sm" className="rounded-full">
              Sales
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
