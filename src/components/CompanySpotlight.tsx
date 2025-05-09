
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building, Users, MapPin } from 'lucide-react';

interface CompanyProps {
  id: string;
  name: string;
  industry: string;
  location: string;
  employees: string;
  logo: string;
  openPositions: number;
  description: string;
}

const companies: CompanyProps[] = [
  {
    id: '1',
    name: 'TechGrowth Inc.',
    industry: 'Software Development',
    location: 'San Francisco, CA',
    employees: '500-1000',
    logo: 'https://images.unsplash.com/photo-1549923746-c502d488b3ea?w=200&h=200&auto=format&q=80',
    openPositions: 12,
    description: 'Leading provider of enterprise software solutions focused on AI and machine learning technologies.'
  },
  {
    id: '2',
    name: 'DesignHub',
    industry: 'Design Services',
    location: 'Remote',
    employees: '50-200',
    logo: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=200&h=200&auto=format&q=80',
    openPositions: 5,
    description: 'Creative agency specializing in UI/UX design, branding, and digital experience.'
  },
  {
    id: '3',
    name: 'GrowthBoost',
    industry: 'Marketing',
    location: 'New York, NY',
    employees: '100-500',
    logo: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&h=200&auto=format&q=80',
    openPositions: 8,
    description: 'Full-service digital marketing agency helping businesses scale through innovative strategies.'
  },
  {
    id: '4',
    name: 'DataInsight',
    industry: 'Data Analytics',
    location: 'Remote',
    employees: '200-500',
    logo: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=200&h=200&auto=format&q=80',
    openPositions: 15,
    description: 'Transforming business data into actionable insights through advanced analytics and AI.'
  }
];

const CompanyCard = ({ company }: { company: CompanyProps }) => {
  return (
    <Card className="card-hover h-full">
      <CardContent className="p-6">
        <div className="flex flex-col items-center text-center">
          <div className="h-16 w-16 rounded-xl bg-gray-100 p-2 flex items-center justify-center mb-4">
            <img 
              src={company.logo} 
              alt={`${company.name} logo`}
              className="h-full w-full object-cover rounded-lg"
            />
          </div>
          
          <h3 className="font-heading font-semibold text-lg mb-2">{company.name}</h3>
          <p className="text-sm text-gray-600 mb-4">{company.industry}</p>
          
          <div className="w-full space-y-2 mb-4">
            <div className="flex items-center text-sm text-gray-600 justify-center">
              <MapPin className="h-3.5 w-3.5 mr-1.5" />
              {company.location}
            </div>
            <div className="flex items-center text-sm text-gray-600 justify-center">
              <Users className="h-3.5 w-3.5 mr-1.5" />
              {company.employees} employees
            </div>
            <div className="flex items-center text-sm font-medium text-jobmojo-primary justify-center">
              <Building className="h-3.5 w-3.5 mr-1.5" />
              {company.openPositions} open positions
            </div>
          </div>
          
          <Button variant="outline" size="sm" className="w-full">View Company</Button>
        </div>
      </CardContent>
    </Card>
  );
};

const CompanySpotlight = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-heading font-semibold mb-4">Featured Companies Hiring Now</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover opportunities with these leading companies that are actively looking for talent like you
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {companies.map((company) => (
            <CompanyCard key={company.id} company={company} />
          ))}
        </div>
        
        <div className="mt-10 text-center">
          <Button>Browse All Companies</Button>
        </div>
      </div>
    </section>
  );
};

export default CompanySpotlight;
