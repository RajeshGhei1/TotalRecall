
import React from 'react';
import { Button } from "@/components/ui/button";
import { SparklesIcon, Menu } from 'lucide-react';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md shadow-sm">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-1">
          <SparklesIcon className="h-6 w-6 text-jobmojo-primary" />
          <span className="text-xl font-heading font-bold text-jobmojo-dark">
            Job<span className="text-jobmojo-primary">Mojo</span>
          </span>
        </div>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          <a href="#" className="text-sm font-medium hover:text-jobmojo-primary transition">Find Jobs</a>
          <a href="#" className="text-sm font-medium hover:text-jobmojo-primary transition">Companies</a>
          <a href="#" className="text-sm font-medium hover:text-jobmojo-primary transition">Resources</a>
          <a href="#" className="text-sm font-medium hover:text-jobmojo-primary transition">Career Advice</a>
        </div>
        
        <div className="hidden md:flex items-center space-x-2">
          <Button variant="ghost" size="sm">Sign In</Button>
          <Button size="sm">Post a Job</Button>
        </div>
        
        {/* Mobile Menu Button */}
        <button 
          className="md:hidden p-2 rounded-md hover:bg-gray-100"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>
      
      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="container mx-auto px-4 py-2 flex flex-col space-y-3">
            <a href="#" className="py-2 text-sm font-medium hover:text-jobmojo-primary">Find Jobs</a>
            <a href="#" className="py-2 text-sm font-medium hover:text-jobmojo-primary">Companies</a>
            <a href="#" className="py-2 text-sm font-medium hover:text-jobmojo-primary">Resources</a>
            <a href="#" className="py-2 text-sm font-medium hover:text-jobmojo-primary">Career Advice</a>
            <div className="pt-2 flex space-x-2">
              <Button variant="ghost" size="sm" className="w-full">Sign In</Button>
              <Button size="sm" className="w-full">Post a Job</Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
