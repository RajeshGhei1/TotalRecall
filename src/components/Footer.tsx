
import { SparklesIcon } from 'lucide-react';
import { Separator } from "@/components/ui/separator";

const Footer = () => {
  return (
    <footer className="bg-white pt-12 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <SparklesIcon className="h-5 w-5 text-jobmojo-primary" />
              <span className="text-lg font-heading font-bold">
                TOTAL <span className="text-jobmojo-primary">RECALL</span>.ai
              </span>
            </div>
            <p className="text-gray-500 text-sm mb-4">
              AI-powered knowledge management and cognitive assistance platform revolutionizing business operations.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-jobmojo-primary transition">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle>
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-jobmojo-primary transition">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-jobmojo-primary transition">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="font-heading font-medium text-base mb-4">Enterprise Solutions</h3>
            <div className="space-y-2.5 text-sm">
              <div><a href="#" className="text-gray-600 hover:text-jobmojo-primary">Workflow Designer</a></div>
              <div><a href="#" className="text-gray-600 hover:text-jobmojo-primary">AI Analytics</a></div>
              <div><a href="#" className="text-gray-600 hover:text-jobmojo-primary">Integration Hub</a></div>
              <div><a href="#" className="text-gray-600 hover:text-jobmojo-primary">Knowledge Management</a></div>
              <div><a href="#" className="text-gray-600 hover:text-jobmojo-primary">Cognitive Assistance</a></div>
            </div>
          </div>
          
          <div>
            <h3 className="font-heading font-medium text-base mb-4">Industries</h3>
            <div className="space-y-2.5 text-sm">
              <div><a href="#" className="text-gray-600 hover:text-jobmojo-primary">Financial Services</a></div>
              <div><a href="#" className="text-gray-600 hover:text-jobmojo-primary">Healthcare</a></div>
              <div><a href="#" className="text-gray-600 hover:text-jobmojo-primary">Manufacturing</a></div>
              <div><a href="#" className="text-gray-600 hover:text-jobmojo-primary">Technology</a></div>
              <div><a href="#" className="text-gray-600 hover:text-jobmojo-primary">Professional Services</a></div>
            </div>
          </div>
          
          <div>
            <h3 className="font-heading font-medium text-base mb-4">Company</h3>
            <div className="space-y-2.5 text-sm">
              <div><a href="#" className="text-gray-600 hover:text-jobmojo-primary">About Us</a></div>
              <div><a href="#" className="text-gray-600 hover:text-jobmojo-primary">Contact</a></div>
              <div><a href="#" className="text-gray-600 hover:text-jobmojo-primary">Success Stories</a></div>
              <div><a href="#" className="text-gray-600 hover:text-jobmojo-primary">Privacy Policy</a></div>
              <div><a href="#" className="text-gray-600 hover:text-jobmojo-primary">Terms of Service</a></div>
            </div>
          </div>
        </div>
        
        <Separator className="my-6" />
        
        <div className="text-sm text-gray-500 text-center">
          &copy; {new Date().getFullYear()} TOTAL RECALL. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
