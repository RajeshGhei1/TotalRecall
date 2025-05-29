
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building, TrendingUp, Users, Zap } from 'lucide-react';

interface EnterpriseClientProps {
  id: string;
  name: string;
  industry: string;
  size: string;
  logo: string;
  productivityGain: string;
  primaryUseCase: string;
  description: string;
  metrics: {
    efficiency: string;
    timeReduction: string;
    cognitiveLoad: string;
  };
}

const enterpriseClients: EnterpriseClientProps[] = [
  {
    id: '1',
    name: 'Global Financial Corp',
    industry: 'Financial Services',
    size: '10,000+ employees',
    logo: 'https://images.unsplash.com/photo-1549923746-c502d488b3ea?w=200&h=200&auto=format&q=80',
    productivityGain: '340%',
    primaryUseCase: 'Financial Analytics & Compliance',
    description: 'Transformed financial reporting and compliance workflows with AI-driven knowledge orchestration.',
    metrics: {
      efficiency: '340% productivity increase',
      timeReduction: '75% faster reporting',
      cognitiveLoad: '60% reduced cognitive load'
    }
  },
  {
    id: '2',
    name: 'MegaTech Industries',
    industry: 'Technology',
    size: '5,000+ employees',
    logo: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=200&h=200&auto=format&q=80',
    productivityGain: '280%',
    primaryUseCase: 'Cross-Department Workflow Automation',
    description: 'Unified all departments with intelligent workflow automation and cognitive assistance.',
    metrics: {
      efficiency: '280% operational efficiency',
      timeReduction: '65% faster decisions',
      cognitiveLoad: '50% reduced mental overhead'
    }
  },
  {
    id: '3',
    name: 'Healthcare Innovations',
    industry: 'Healthcare',
    size: '2,500+ employees',
    logo: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&h=200&auto=format&q=80',
    productivityGain: '420%',
    primaryUseCase: 'Knowledge Management & Patient Care',
    description: 'Revolutionized patient care through intelligent knowledge orchestration and predictive insights.',
    metrics: {
      efficiency: '420% care efficiency',
      timeReduction: '80% faster diagnosis',
      cognitiveLoad: '70% reduced admin burden'
    }
  },
  {
    id: '4',
    name: 'Manufacturing Excellence',
    industry: 'Manufacturing',
    size: '8,000+ employees',
    logo: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=200&h=200&auto=format&q=80',
    productivityGain: '310%',
    primaryUseCase: 'Operational Intelligence & Quality Control',
    description: 'Streamlined manufacturing operations with AI-powered quality control and predictive maintenance.',
    metrics: {
      efficiency: '310% operational efficiency',
      timeReduction: '70% faster quality control',
      cognitiveLoad: '55% reduced complexity'
    }
  }
];

const EnterpriseClientCard = ({ client }: { client: EnterpriseClientProps }) => {
  return (
    <Card className="card-hover h-full">
      <CardContent className="p-6">
        <div className="flex flex-col">
          <div className="flex items-center mb-4">
            <div className="h-12 w-12 rounded-lg bg-gray-100 p-2 flex items-center justify-center mr-4">
              <img 
                src={client.logo} 
                alt={`${client.name} logo`}
                className="h-full w-full object-cover rounded"
              />
            </div>
            <div>
              <h3 className="font-heading font-semibold text-lg">{client.name}</h3>
              <p className="text-sm text-gray-600">{client.industry}</p>
            </div>
          </div>
          
          <div className="mb-4">
            <div className="flex items-center text-2xl font-bold text-jobmojo-primary mb-1">
              <TrendingUp className="h-5 w-5 mr-2" />
              {client.productivityGain}
            </div>
            <p className="text-sm text-gray-600">Productivity Increase</p>
          </div>

          <div className="space-y-2 mb-4">
            <div className="flex items-center text-sm text-gray-600">
              <Users className="h-3.5 w-3.5 mr-2" />
              {client.size}
            </div>
            <div className="flex items-center text-sm font-medium text-jobmojo-secondary">
              <Zap className="h-3.5 w-3.5 mr-2" />
              {client.primaryUseCase}
            </div>
          </div>

          <p className="text-sm text-gray-600 mb-4">{client.description}</p>

          <div className="grid grid-cols-1 gap-2 mb-4 text-xs">
            <div className="bg-green-50 p-2 rounded">
              <span className="font-medium text-green-800">{client.metrics.efficiency}</span>
            </div>
            <div className="bg-blue-50 p-2 rounded">
              <span className="font-medium text-blue-800">{client.metrics.timeReduction}</span>
            </div>
            <div className="bg-purple-50 p-2 rounded">
              <span className="font-medium text-purple-800">{client.metrics.cognitiveLoad}</span>
            </div>
          </div>
          
          <Button variant="outline" size="sm" className="w-full">View Case Study</Button>
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
          <h2 className="text-2xl md:text-3xl font-heading font-semibold mb-4">Enterprise Success Stories</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            See how industry leaders have transformed their operations with TOTAL RECALL's 
            AI-powered knowledge orchestration and cognitive assistance platform
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {enterpriseClients.map((client) => (
            <EnterpriseClientCard key={client.id} client={client} />
          ))}
        </div>
        
        <div className="mt-10 text-center">
          <Button>Explore All Success Stories</Button>
        </div>
      </div>
    </section>
  );
};

export default CompanySpotlight;
