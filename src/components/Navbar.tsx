
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useSuperAdminCheck } from '@/hooks/useSuperAdminCheck';

export const Navbar = () => {
  const { user, signOut } = useAuth();
  const { isSuperAdmin } = useSuperAdminCheck();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0">
            <Link to="/" className="text-2xl font-bold text-indigo-600">
              Total Recall AI
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-6">
            <a 
              href="#apps" 
              onClick={(e) => {
                e.preventDefault();
                document.getElementById('apps')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="text-gray-700 hover:text-indigo-600 transition-colors"
            >
              Apps
            </a>
            <a 
              href="#features" 
              onClick={(e) => {
                e.preventDefault();
                document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="text-gray-700 hover:text-indigo-600 transition-colors"
            >
              Features
            </a>
            <a 
              href="#industries" 
              onClick={(e) => {
                e.preventDefault();
                document.getElementById('industries')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="text-gray-700 hover:text-indigo-600 transition-colors"
            >
              Industries
            </a>
            {!user && (
              <Link to="/pricing">
                <Button variant="ghost" className="text-gray-700 hover:text-indigo-600">
                  Pricing
                </Button>
              </Link>
            )}
            {user && (
              <Link to={isSuperAdmin ? "/superadmin/dashboard" : "/tenant-admin"}>
                <Button variant="ghost" className="text-gray-700 hover:text-indigo-600">
                  Dashboard
                </Button>
              </Link>
            )}
            <a 
              href="#help" 
              onClick={(e) => {
                e.preventDefault();
                document.getElementById('help')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="text-gray-700 hover:text-indigo-600 transition-colors"
            >
              Help
            </a>
          </div>
          
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <span className="text-sm text-gray-600">{user.email}</span>
                <Button variant="ghost" onClick={handleSignOut} className="text-gray-700 hover:text-indigo-600">
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Link to="/auth">
                  <Button variant="ghost" className="text-gray-700 hover:text-indigo-600">
                    Sign In
                  </Button>
                </Link>
                <Link to="/auth">
                  <Button className="bg-indigo-600 hover:bg-indigo-700">
                    Try it free
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
