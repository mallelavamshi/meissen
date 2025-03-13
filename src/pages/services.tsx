import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router";
import { Check } from "lucide-react";

export default function ServicesPage() {
  const services = [
    {
      title: "AI Image Analysis",
      description: "Our core service uses advanced AI to identify items in your photos and provide detailed information.",
      features: [
        "Automatic item identification",
        "Price estimation based on market data",
        "Brand and material recognition",
        "Condition assessment assistance",
        "Similar item comparisons"
      ],
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-12 w-12 text-primary">
          <rect width="18" height="18" x="3" y="3" rx="2" />
          <circle cx="9" cy="9" r="2" />
          <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
        </svg>
      )
    },
    {
      title: "Batch Processing",
      description: "Upload and process multiple images at once for efficient cataloging of large collections.",
      features: [
        "Process up to 200 images simultaneously",
        "Automatic categorization",
        "Bulk export options",
        "Progress tracking",
        "Error handling and retries"
      ],
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-12 w-12 text-primary">
          <rect width="7" height="7" x="3" y="3" rx="1" />
          <rect width="7" height="7" x="14" y="3" rx="1" />
          <rect width="7" height="7" x="14" y="14" rx="1" />
          <rect width="7" height="7" x="3" y="14" rx="1" />
        </svg>
      )
    },
    {
      title: "Custom Reports",
      description: "Generate professional reports with your branding for clients and internal use.",
      features: [
        "PDF and Excel export formats",
        "Custom branding and templates",
        "Detailed item descriptions",
        "Price comparisons and ranges",
        "Image galleries with annotations"
      ],
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-12 w-12 text-primary">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <path d="M14 2v6h6" />
          <path d="M16 13H8" />
          <path d="M16 17H8" />
          <path d="M10 9H8" />
        </svg>
      )
    },
    {
      title: "API Access",
      description: "Integrate our AI analysis capabilities directly into your existing software systems.",
      features: [
        "RESTful API with comprehensive documentation",
        "Webhook support for asynchronous processing",
        "Authentication and rate limiting",
        "Sample code and SDKs",
        "Technical support for integration"
      ],
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-12 w-12 text-primary">
          <path d="M18 20V6a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v14" />
          <path d="M2 20h20" />
          <path d="M14 12v.01" />
        </svg>
      )
    }
  ];
  
  return (
    <MainLayout>
      <div className="container py-12 md:py-16">
        <div className="text-center space-y-4 mb-12">
          <h1 className="text-3xl md:text-4xl font-bold">Our Services</h1>
          <p className="text-muted-foreground md:text-lg max-w-2xl mx-auto">
            Discover how our AI-powered tools can transform your estate sale or auction business.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {services.map((service, index) => (
            <Card key={index} className="flex flex-col h-full">
              <CardHeader>
                <div className="mb-4">{service.icon}</div>
                <CardTitle>{service.title}</CardTitle>
                <CardDescription>{service.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <ul className="space-y-2">
                  {service.features.map((feature, i) => (
                    <li key={i} className="flex items-start">
                      <Check className="h-5 w-5 text-primary mr-2 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full">
                  <Link to="/pricing">Learn More</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
        
        <div className="bg-muted rounded-lg p-8 md:p-12 mb-16">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold mb-4 text-center">How It Works</h2>
            <div className="grid md:grid-cols-3 gap-8 mt-8">
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <span className="text-primary font-bold">1</span>
                </div>
                <h3 className="font-medium mb-2">Upload Images</h3>
                <p className="text-sm text-muted-foreground">
                  Upload photos from your device or take pictures directly with your camera.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <span className="text-primary font-bold">2</span>
                </div>
                <h3 className="font-medium mb-2">AI Analysis</h3>
                <p className="text-sm text-muted-foreground">
                  Our AI processes your images to identify items and gather market data.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <span className="text-primary font-bold">3</span>
                </div>
                <h3 className="font-medium mb-2">Get Results</h3>
                <p className="text-sm text-muted-foreground">
                  View detailed analysis and download reports in your preferred format.
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold mb-6 text-center">Frequently Asked Questions</h2>
          <div className="space-y-6">
            <div>
              <h3 className="font-medium mb-2">How accurate is the AI image analysis?</h3>
              <p className="text-muted-foreground">
                Our AI system has been trained on millions of items and achieves an accuracy rate of over 90% for common items found in estate sales and auctions. The system continues to learn and improve over time.
              </p>
            </div>
            
            <div>
              <h3 className="font-medium mb-2">What types of items can the system identify?</h3>
              <p className="text-muted-foreground">
                Our system can identify a wide range of items including furniture, artwork, jewelry, collectibles, antiques, electronics, clothing, and household goods. It's particularly strong with branded items and recognizable styles.
              </p>
            </div>
            
            <div>
              <h3 className="font-medium mb-2">How long does the analysis process take?</h3>
              <p className="text-muted-foreground">
                Most individual images are processed within 10-15 seconds. Batch processing times depend on the number of images and current system load, but typically process at a rate of 5-10 images per minute.
              </p>
            </div>
            
            <div>
              <h3 className="font-medium mb-2">Can I customize the reports?</h3>
              <p className="text-muted-foreground">
                Yes, Professional and Enterprise subscribers can customize reports with their company logo, contact information, and preferred formatting. You can also choose which data points to include or exclude.
              </p>
            </div>
          </div>
        </div>
        
        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold mb-4">Ready to Transform Your Business?</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-6">
            Start using our AI-powered image analysis tools today and see the difference they can make for your estate sale or auction business.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg">
              <Link to="/">Try It Free</Link>
            </Button>
            <Button variant="outline" asChild size="lg">
              <Link to="/pricing">View Pricing</Link>
            </Button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}