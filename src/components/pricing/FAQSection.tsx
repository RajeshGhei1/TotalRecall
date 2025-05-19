
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface FAQItem {
  question: string;
  answer: string;
}

const FAQSection: React.FC = () => {
  const faqItems: FAQItem[] = [
    {
      question: "How does the free trial work?",
      answer: "All paid plans come with a 14-day free trial. You can explore all features without any commitment. No credit card required to start your trial."
    },
    {
      question: "Can I change my plan later?",
      answer: "Yes, you can upgrade or downgrade your plan at any time. When you upgrade, you'll be prorated for the remainder of your billing cycle. When you downgrade, changes take effect at the end of your current billing cycle."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards including Visa, Mastercard, American Express, and Discover. For Enterprise plans, we also offer invoicing options. For India, we support UPI and net banking."
    },
    {
      question: "Are there any hidden fees?",
      answer: "No, there are no hidden fees or setup costs. You only pay the advertised monthly or annual subscription price. All prices are inclusive of applicable taxes."
    },
    {
      question: "Do you offer discounts for startups or non-profits?",
      answer: "Yes, we offer special pricing for eligible startups and non-profit organizations. Please contact our sales team to learn more about our discount programs."
    }
  ];

  return (
    <section className="container mx-auto py-16 px-4 sm:px-6">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          Have questions about our pricing? We've got answers.
        </p>
      </div>
      
      <div className="max-w-3xl mx-auto space-y-6">
        {faqItems.map((item, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle>{item.question}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{item.answer}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default FAQSection;
