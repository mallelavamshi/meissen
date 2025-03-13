import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router";

export default function AboutPage() {
  return (
    <MainLayout>
      <div className="container py-12 md:py-16">
        <div className="text-center space-y-4 mb-12">
          <h1 className="text-3xl md:text-4xl font-bold">About ImageInsight</h1>
          <p className="text-muted-foreground md:text-lg max-w-2xl mx-auto">
            Transforming the estate sale and auction industry with AI-powered image analysis.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
            <p className="text-muted-foreground mb-4">
              At ImageInsight, we're on a mission to revolutionize how estate sale companies and auction houses identify, catalog, and value items. By harnessing the power of artificial intelligence, we're making the appraisal process faster, more accurate, and more accessible than ever before.
            </p>
            <p className="text-muted-foreground">
              Our goal is to empower professionals in the industry with tools that save time, reduce errors, and ultimately increase profitability. We believe that technology should enhance human expertise, not replace it.
            </p>
          </div>
          <div className="bg-muted rounded-lg aspect-video flex items-center justify-center">
            <div className="text-center p-8">
              <p className="text-lg font-medium">Image Placeholder</p>
              <p className="text-sm text-muted-foreground">Company team or office photo</p>
            </div>
          </div>
        </div>
        
        <div className="mb-16">
          <h2 className="text-2xl font-bold mb-6 text-center">Our Story</h2>
          <div className="max-w-3xl mx-auto">
            <p className="mb-4">
              ImageInsight was founded in 2022 by a team of technology experts and estate sale professionals who recognized a gap in the market. The traditional methods of cataloging and appraising items for estate sales and auctions were time-consuming, inconsistent, and often relied on subjective assessments.
            </p>
            <p className="mb-4">
              Our founders envisioned a solution that would combine cutting-edge AI technology with the practical needs of industry professionals. After months of development and testing with partners in the field, ImageInsight was born.
            </p>
            <p>
              Today, we serve hundreds of estate sale companies and auction houses across the country, helping them streamline their operations and provide better service to their clients. As we continue to grow, we remain committed to innovation and excellence in everything we do.
            </p>
          </div>
        </div>
        
        <div className="mb-16">
          <h2 className="text-2xl font-bold mb-6 text-center">Our Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="text-center">
                <div className="w-32 h-32 rounded-full bg-muted mx-auto mb-4 flex items-center justify-center">
                  <span className="text-muted-foreground">Photo</span>
                </div>
                <h3 className="font-medium">Jane Doe</h3>
                <p className="text-sm text-muted-foreground">Co-Founder & CEO</p>
              </div>
            ))}
          </div>
        </div>
        
        <div className="bg-muted rounded-lg p-8 md:p-12 text-center mb-16">
          <h2 className="text-2xl font-bold mb-4">Our Technology</h2>
          <p className="text-muted-foreground max-w-3xl mx-auto mb-6">
            ImageInsight leverages multiple AI technologies to deliver accurate and comprehensive analysis. Our platform combines image recognition, price comparison algorithms, and deep learning models trained on millions of auction and retail listings.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            <div className="bg-card p-4 rounded-lg">
              <h3 className="font-medium mb-2">Image Recognition</h3>
              <p className="text-sm text-muted-foreground">
                Identifies objects, brands, and styles with high accuracy
              </p>
            </div>
            <div className="bg-card p-4 rounded-lg">
              <h3 className="font-medium mb-2">Market Analysis</h3>
              <p className="text-sm text-muted-foreground">
                Compares items to recent sales data for accurate pricing
              </p>
            </div>
            <div className="bg-card p-4 rounded-lg">
              <h3 className="font-medium mb-2">Report Generation</h3>
              <p className="text-sm text-muted-foreground">
                Creates detailed, customizable reports in multiple formats
              </p>
            </div>
          </div>
        </div>
        
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-6">
            Join hundreds of estate sale companies and auction houses already using ImageInsight to streamline their operations.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg">
              <Link to="/">Try It Free</Link>
            </Button>
            <Button variant="outline" asChild size="lg">
              <Link to="/contact">Contact Sales</Link>
            </Button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}