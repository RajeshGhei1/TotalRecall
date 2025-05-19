
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Crown, Tag } from 'lucide-react';

export interface PricingFeature {
  text: string;
}

interface PricingCardProps {
  title: string;
  price: string | React.ReactNode;
  description: string;
  features: PricingFeature[];
  isPopular?: boolean;
  buttonText: string;
  buttonVariant?: "default" | "outline";
  iconType?: "tag" | "crown" | "crownSecondary";
  annualBilling?: boolean;
  annualPrice?: string;
}

const PricingCard: React.FC<PricingCardProps> = ({
  title,
  price,
  description,
  features,
  isPopular = false,
  buttonText,
  buttonVariant = "outline",
  iconType = "tag",
  annualBilling = false,
  annualPrice,
}) => {
  const renderIcon = () => {
    switch (iconType) {
      case "crown":
        return <Crown className="mr-2 h-5 w-5 text-primary" />;
      case "crownSecondary":
        return <Crown className="mr-2 h-5 w-5 text-secondary" />;
      case "tag":
      default:
        return <Tag className="mr-2 h-5 w-5 text-primary" />;
    }
  };

  return (
    <Card className={`card-hover ${isPopular ? 'card-gradient relative overflow-hidden border-primary/50 shadow-lg' : ''}`}>
      {isPopular && (
        <div className="absolute top-0 right-0 bg-primary text-primary-foreground px-3 py-1 text-xs font-medium">
          MOST POPULAR
        </div>
      )}
      <CardHeader>
        <CardTitle className="flex items-center text-2xl font-bold">
          {renderIcon()}
          {title}
        </CardTitle>
        <div className="mt-4">
          <span className="text-4xl font-bold">{price}</span>
          {typeof price !== "string" || price !== "Free" ? (
            <span className="text-muted-foreground ml-2">/month</span>
          ) : null}
        </div>
        <CardDescription className="mt-2">
          {annualBilling && annualPrice ? (
            <span className="text-sm">{description}<br />{annualPrice}</span>
          ) : (
            description
          )}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start">
              <Check className="mr-2 h-5 w-5 text-primary mt-0.5" />
              <span>{feature.text}</span>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter>
        <Button variant={buttonVariant} size="lg" className="w-full">{buttonText}</Button>
      </CardFooter>
    </Card>
  );
};

export default PricingCard;
