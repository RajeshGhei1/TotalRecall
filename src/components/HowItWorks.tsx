
import React from 'react';

export const HowItWorks = () => {
  const steps = [
    {
      title: "Sign Up",
      description: "Create your account and choose the perfect plan for your business needs.",
      icon: "1"
    },
    {
      title: "Configure",
      description: "Set up your modules and customize the platform to match your workflow.",
      icon: "2"
    },
    {
      title: "Optimize",
      description: "Let our AI learn your patterns and optimize your business processes.",
      icon: "3"
    }
  ];

  return (
    <div className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:text-center">
          <h2 className="text-base text-indigo-600 font-semibold tracking-wide uppercase">How It Works</h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            Get started in three simple steps
          </p>
        </div>

        <div className="mt-10">
          <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-3 md:gap-x-8 md:gap-y-10">
            {steps.map((step) => (
              <div key={step.title} className="relative">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white text-lg font-bold mx-auto">
                  {step.icon}
                </div>
                <div className="mt-5 text-center">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">{step.title}</h3>
                  <p className="mt-2 text-base text-gray-500">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
