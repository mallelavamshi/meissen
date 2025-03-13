import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from "lucide-react";
import { Link } from "react-router";
import { useUserStore } from "@/lib/stores/userStore";

export default function PricingPage() {
  const { user } = useUserStore();
  
  const plans = [
    {
      name: "Free",
      description: "For individuals just getting started",
      price: "$0",
      features: [
        "15 images per session",
        "3 sessions per day",
        "Basic analysis results",
        "PDF & Excel exports",
        "Email support"
      ],
      limitations: [
        "No batch processing",
        "No API access",
        "Limited result history"
      ],
      cta: "Get Started",
      href: user ? "/" : "/signup",
      popular: false
    },
    {
      name: "Basic",
      description: "For small estate sale businesses",
      price: "$29",
      period: "per month",
      features: [
        "Unlimited images",
        "Unlimited sessions",
        "Advanced analysis results",
        "PDF & Excel exports",
        "Priority email support",
        "30-day result history",
        "Batch processing up to 50 images"
      ],
      limitations: [
        "No API access"
      ],
      cta: "Subscribe",
      href: user ? "/dashboard?tab=subscription" : "/signup",
      popular: true
    },
    {
      name: "Professional",
      description: "For auction houses and large businesses",
      price: "$99",
      period: "per month",
      features: [
        "Everything in Basic",
        "Unlimited result history",
        "Batch processing up to 200 images",
        "API access",
        "Phone support",
        "Custom branding on exports",
        "Team access (up to 5 users)"
      ],
      cta: "Subscribe",
      href: user ? "/dashboard?tab=subscription" : "/signup",
      popular: false
    }
  ];
  
  return (
    <MainLayout>
      <div className="container py-12 md:py-16">
        <div className="text-center space-y-4 mb-12">
          <h1 className="text-3xl md:text-4xl font-bold">Simple, Transparent Pricing</h1>
          <p className="text-muted-foreground md:text-lg max-w-2xl mx-auto">
            Choose the plan that's right for your business. All plans include access to our AI-powered image analysis tools.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {plans.map((plan) => (
            <Card key={plan.name} className={`flex flex-col ${plan.popular ? 'border-primary shadow-lg' : ''}`}>
              {plan.popular && (
                <div className="bg-primary text-primary-foreground text-center py-1 text-sm font-medium">
                  Most Popular
                </div>
              )}
              <CardHeader>
                <CardTitle>{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
                <div className="mt-4">
                  <span className="text-3xl font-bold">{plan.price}</span>
                  {plan.period && (
                    <span className="text-muted-foreground ml-1">{plan.period}</span>
                  )}
                </div>
              </CardHeader>
              <CardContent className="flex-1">
                <ul className="space-y-2">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center">
                      <Check className="h-4 w-4 text-primary mr-2" />
                      <span>{feature}</span>
                    </li>
                  ))}
                  {plan.limitations && plan.limitations.map((limitation) => (
                    <li key={limitation} className="flex items-center text-muted-foreground">
                      <span className="h-4 w-4 mr-2">✕</span>
                      <span>{limitation}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button 
                  asChild 
                  className="w-full" 
                  variant={plan.popular ? "default" : "outline"}
                >
                  <Link to={plan.href}>{plan.cta}</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
        
        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold mb-4">Frequently Asked Questions</h2>
          <div className="max-w-3xl mx-auto space-y-6 text-left">
            <div>
              <h3 className="font-medium mb-2">How accurate is the AI image analysis?</h3>
              <p className="text-muted-foreground">
                Our AI analysis is highly accurate for most common items found in estate sales and auctions. The system is continuously learning and improving based on user feedback.
              </p>
            </div>
            <div>
              <h3 className="font-medium mb-2">Can I cancel my subscription at any time?</h3>
              <p className="text-muted-foreground">
                Yes, you can cancel your subscription at any time. Your access will continue until the end of your current billing period.
              </p>
            </div>
            <div>
              <h3 className="font-medium mb-2">Is there a limit to how many images I can analyze?</h3>
              <p className="text-muted-foreground">
                Free users are limited to 15 images per session and 3 sessions per day. Paid plans offer unlimited images and sessions, with batch processing limits varying by plan.
              </p>
            </div>
            <div>
              <h3 className="font-medium mb-2">Do you offer custom enterprise plans?</h3>
              <p className="text-muted-foreground">
                Yes, we offer custom enterprise plans for large organizations with specific needs. Please contact our sales team for more information.
              </p>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}