
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { atsService } from '@/services/atsService';
import { toast } from '@/hooks/use-toast';
import { useTenantContext } from '@/contexts/TenantContext';

interface CreateTestDataDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDataCreated: () => void;
}

const CreateTestDataDialog = ({ open, onOpenChange, onDataCreated }: CreateTestDataDialogProps) => {
  const { selectedTenantId } = useTenantContext();
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState('');
  const [isComplete, setIsComplete] = useState(false);

  const testJobs = [
    {
      title: "Senior Full Stack Developer",
      description: "We're looking for an experienced full stack developer to join our team. You'll be working on cutting-edge web applications using modern technologies.",
      requirements: ["React", "Node.js", "TypeScript", "PostgreSQL", "AWS", "Docker", "5+ years experience"],
      location: "San Francisco, CA",
      department: "Engineering",
      employment_type: "full-time",
      salary_min: 120000,
      salary_max: 160000,
      status: "active" as const,
      priority: "high" as const
    },
    {
      title: "Data Scientist",
      description: "Join our data team to build machine learning models and extract insights from large datasets.",
      requirements: ["Python", "Machine Learning", "SQL", "TensorFlow", "Pandas", "Statistics", "3+ years experience"],
      location: "Remote",
      department: "Data Science",
      employment_type: "full-time",
      salary_min: 100000,
      salary_max: 140000,
      status: "active" as const,
      priority: "medium" as const
    },
    {
      title: "Product Manager",
      description: "Lead product strategy and work with cross-functional teams to deliver exceptional user experiences.",
      requirements: ["Product Strategy", "User Research", "Agile", "Analytics", "Communication", "MBA preferred", "4+ years experience"],
      location: "New York, NY",
      department: "Product",
      employment_type: "full-time",
      salary_min: 110000,
      salary_max: 150000,
      status: "active" as const,
      priority: "high" as const
    }
  ];

  const testCandidates = [
    {
      first_name: "Sarah",
      last_name: "Johnson",
      email: "sarah.johnson@example.com",
      phone: "+1 (555) 123-4567",
      location: "San Francisco, CA",
      linkedin_url: "https://linkedin.com/in/sarahjohnson",
      current_title: "Senior Software Engineer",
      current_company: "TechCorp",
      experience_years: 6,
      skills: ["React", "Node.js", "TypeScript", "Python", "AWS", "Docker", "GraphQL"],
      desired_salary: 145000,
      tags: ["experienced", "full-stack", "startup-ready"],
      ai_summary: "Highly skilled full-stack developer with 6 years of experience in modern web technologies. Strong background in React and Node.js with cloud deployment experience."
    },
    {
      first_name: "Michael",
      last_name: "Chen",
      email: "michael.chen@example.com",
      phone: "+1 (555) 234-5678",
      location: "Austin, TX",
      linkedin_url: "https://linkedin.com/in/michaelchen",
      current_title: "Data Scientist",
      current_company: "DataFlow Inc",
      experience_years: 4,
      skills: ["Python", "Machine Learning", "TensorFlow", "SQL", "Pandas", "Statistics", "Deep Learning"],
      desired_salary: 125000,
      tags: ["ml-expert", "python", "analytics"],
      ai_summary: "Experienced data scientist specializing in machine learning and statistical analysis. Strong background in Python and TensorFlow with proven track record in model deployment."
    },
    {
      first_name: "Emily",
      last_name: "Rodriguez",
      email: "emily.rodriguez@example.com",
      phone: "+1 (555) 345-6789",
      location: "New York, NY",
      linkedin_url: "https://linkedin.com/in/emilyrodriguez",
      current_title: "Product Manager",
      current_company: "InnovateLabs",
      experience_years: 5,
      skills: ["Product Strategy", "User Research", "Agile", "Analytics", "A/B Testing", "Roadmapping"],
      desired_salary: 135000,
      tags: ["product-lead", "strategy", "user-focused"],
      ai_summary: "Strategic product manager with 5 years of experience leading cross-functional teams. Expert in user research and data-driven product decisions."
    },
    {
      first_name: "David",
      last_name: "Kim",
      email: "david.kim@example.com",
      phone: "+1 (555) 456-7890",
      location: "Seattle, WA",
      linkedin_url: "https://linkedin.com/in/davidkim",
      current_title: "Frontend Developer",
      current_company: "WebSolutions",
      experience_years: 3,
      skills: ["React", "JavaScript", "CSS", "HTML", "Vue.js", "Figma"],
      desired_salary: 95000,
      tags: ["frontend", "ui-ux", "creative"],
      ai_summary: "Creative frontend developer with 3 years of experience building responsive web applications. Strong eye for design and user experience."
    },
    {
      first_name: "Lisa",
      last_name: "Thompson",
      email: "lisa.thompson@example.com",
      phone: "+1 (555) 567-8901",
      location: "Remote",
      linkedin_url: "https://linkedin.com/in/lisathompson",
      current_title: "Machine Learning Engineer",
      current_company: "AI Systems",
      experience_years: 7,
      skills: ["Python", "Machine Learning", "MLOps", "Kubernetes", "TensorFlow", "PyTorch", "AWS"],
      desired_salary: 155000,
      tags: ["ml-engineer", "senior", "mlops"],
      ai_summary: "Senior ML engineer with 7 years of experience in production machine learning systems. Expert in MLOps and model deployment at scale."
    }
  ];

  const createTestDataMutation = useMutation({
    mutationFn: async () => {
      if (!selectedTenantId) {
        throw new Error('No tenant selected');
      }

      const steps = testJobs.length + testCandidates.length;
      let currentStepCount = 0;

      // Create jobs
      setCurrentStep('Creating test jobs...');
      for (const jobData of testJobs) {
        await atsService.createJob({
          ...jobData,
          tenant_id: selectedTenantId
        });
        currentStepCount++;
        setProgress((currentStepCount / steps) * 100);
        // Small delay to show progress
        await new Promise(resolve => setTimeout(resolve, 200));
      }

      // Create candidates
      setCurrentStep('Creating test candidates...');
      for (const candidateData of testCandidates) {
        await atsService.createCandidate({
          ...candidateData,
          tenant_id: selectedTenantId
        });
        currentStepCount++;
        setProgress((currentStepCount / steps) * 100);
        // Small delay to show progress
        await new Promise(resolve => setTimeout(resolve, 200));
      }

      setCurrentStep('Test data creation complete!');
      setIsComplete(true);
    },
    onSuccess: () => {
      toast({
        title: "Test Data Created",
        description: `Successfully created ${testJobs.length} jobs and ${testCandidates.length} candidates for testing.`
      });
      onDataCreated();
    },
    onError: (error: any) => {
      toast({
        title: "Error Creating Test Data",
        description: error.message || "Failed to create test data.",
        variant: "destructive"
      });
    }
  });

  const handleCreateTestData = () => {
    setProgress(0);
    setCurrentStep('');
    setIsComplete(false);
    createTestDataMutation.mutate();
  };

  const handleClose = () => {
    if (!createTestDataMutation.isPending) {
      setProgress(0);
      setCurrentStep('');
      setIsComplete(false);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Create Test Data</DialogTitle>
          <DialogDescription>
            This will create sample jobs and candidates to test the Smart Talent Matching feature.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="text-sm text-muted-foreground">
            <p><strong>Will create:</strong></p>
            <ul className="mt-2 space-y-1">
              <li>• {testJobs.length} sample jobs (Full Stack Dev, Data Scientist, Product Manager)</li>
              <li>• {testCandidates.length} sample candidates with varied skills and experience</li>
            </ul>
          </div>

          {createTestDataMutation.isPending && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm">{currentStep}</span>
              </div>
              <Progress value={progress} className="w-full" />
            </div>
          )}

          {isComplete && (
            <div className="flex items-center gap-2 text-green-600">
              <CheckCircle className="h-4 w-4" />
              <span className="text-sm">Test data created successfully!</span>
            </div>
          )}

          {createTestDataMutation.isError && (
            <div className="flex items-center gap-2 text-red-600">
              <AlertCircle className="h-4 w-4" />
              <span className="text-sm">Failed to create test data</span>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={createTestDataMutation.isPending}
          >
            {isComplete ? 'Close' : 'Cancel'}
          </Button>
          {!isComplete && (
            <Button
              onClick={handleCreateTestData}
              disabled={createTestDataMutation.isPending || !selectedTenantId}
            >
              {createTestDataMutation.isPending ? 'Creating...' : 'Create Test Data'}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateTestDataDialog;
