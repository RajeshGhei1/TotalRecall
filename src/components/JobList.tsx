
import React, { useState } from 'react';
import JobCard, { JobCardProps } from './JobCard';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ArrowRight } from 'lucide-react';

// Sample job data
const jobs: JobCardProps[] = [
  {
    id: '1',
    title: 'Senior Frontend Developer',
    company: 'TechGrowth Inc.',
    location: 'San Francisco, CA',
    type: 'Full-time',
    salary: '$120k - $150k',
    description: 'We are seeking an experienced Frontend Developer proficient in React, TypeScript, and modern web development practices to join our innovative team.',
    posted: '2 days ago',
    logo: 'https://images.unsplash.com/photo-1549923746-c502d488b3ea?w=200&h=200&auto=format&q=80',
    featured: true
  },
  {
    id: '2',
    title: 'Product Designer',
    company: 'DesignHub',
    location: 'Remote',
    type: 'Full-time',
    salary: '$90k - $120k',
    description: 'Join our design team and help create beautiful, intuitive experiences for our global user base. Strong skills in UI/UX required.',
    posted: '3 days ago',
    logo: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=200&h=200&auto=format&q=80'
  },
  {
    id: '3',
    title: 'Marketing Manager',
    company: 'GrowthBoost',
    location: 'New York, NY',
    type: 'Full-time',
    salary: '$85k - $110k',
    description: 'Drive our marketing strategy and campaigns to reach new audiences. Experience with digital marketing, SEO, and content strategy needed.',
    posted: '1 week ago',
    logo: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&h=200&auto=format&q=80'
  },
  {
    id: '4',
    title: 'Backend Developer',
    company: 'ServerPro',
    location: 'Austin, TX',
    type: 'Full-time',
    salary: '$110k - $140k',
    description: 'Develop and maintain scalable backend services. Experience with Node.js, databases, and cloud infrastructure required.',
    posted: '5 days ago',
    logo: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=200&h=200&auto=format&q=80',
    featured: true
  },
  {
    id: '5',
    title: 'Data Scientist',
    company: 'DataInsight',
    location: 'Remote',
    type: 'Full-time',
    salary: '$130k - $160k',
    description: 'Apply machine learning and statistical analysis to solve complex business problems. Strong background in Python and data visualization tools.',
    posted: '2 weeks ago',
    logo: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=200&h=200&auto=format&q=80'
  },
  {
    id: '6',
    title: 'DevOps Engineer',
    company: 'CloudScale',
    location: 'Seattle, WA',
    type: 'Full-time',
    salary: '$120k - $150k',
    description: 'Build and maintain our infrastructure and deployment pipelines. Experience with AWS, Docker, and CI/CD tools required.',
    posted: '3 days ago',
    logo: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=200&h=200&auto=format&q=80'
  }
];

const JobList = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [sortBy, setSortBy] = useState('recent');
  
  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <h2 className="text-2xl font-heading font-semibold">Featured Job Openings</h2>
          
          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <Tabs defaultValue="all" className="w-full sm:w-auto" onValueChange={setActiveTab}>
              <TabsList className="w-full sm:w-auto">
                <TabsTrigger value="all" className="flex-1 sm:flex-initial">All Jobs</TabsTrigger>
                <TabsTrigger value="remote" className="flex-1 sm:flex-initial">Remote</TabsTrigger>
                <TabsTrigger value="featured" className="flex-1 sm:flex-initial">Featured</TabsTrigger>
              </TabsList>
            </Tabs>
            
            <Select defaultValue="recent" onValueChange={setSortBy}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="recent">Most Recent</SelectItem>
                  <SelectItem value="relevant">Most Relevant</SelectItem>
                  <SelectItem value="salary-high">Salary (High to Low)</SelectItem>
                  <SelectItem value="salary-low">Salary (Low to High)</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="grid grid-cols-1 gap-4">
          {jobs
            .filter(job => {
              if (activeTab === 'remote') return job.location === 'Remote';
              if (activeTab === 'featured') return job.featured;
              return true;
            })
            .map((job) => (
              <JobCard key={job.id} {...job} />
            ))}
        </div>
        
        <div className="mt-8 text-center">
          <Button variant="outline" className="rounded-full">
            View All Jobs
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default JobList;
