
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

export const Navbar = () => {
  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0">
            <Link to="/" className="text-2xl font-bold text-indigo-600">
              Total Recall
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            <Link to="/pricing">
              <Button variant="ghost">
                Pricing
              </Button>
            </Link>
            <Link to="/auth">
              <Button>
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};
