import { MainLayout } from "@/components/layout/MainLayout";
import { ImageUploader } from "@/components/ImageUploader";
import { ResultsViewer } from "@/components/ResultsViewer";
import { Button } from "@/components/ui/button";
import { Loader2, AlertTriangle, Camera, FileText, Shield, Zap } from "lucide-react";
import { useAnalysisStore } from "@/lib/stores/analysisStore";
import { useUserStore } from "@/lib/stores/userStore";
import { Link } from "react-router";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const Index = () => {
  const { isProcessing, results } = useAnalysisStore();
  const { user } = useUserStore();
  
  return (
    <MainLayout>
      {user?.role === 'admin' && (
        <div className="mt-6">
          <Alert className="bg-yellow-50 border-yellow-200">
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
            <AlertTitle className="text-yellow-600">API Keys Required</AlertTitle>
            <AlertDescription>
              For full functionality, please set up your API keys in the{" "}
              <Link to="/admin" className="font-medium text-yellow-600 hover:underline">
                Admin Dashboard
              </Link>
              .
            </AlertDescription>
          </Alert>
        </div>
      )}
      
      <section className="py-16 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center text-center space-y-6 mb-12">
            <div className="inline-block p-2 bg-purple-100 rounded-full mb-2">
              <Camera className="h-6 w-6 text-purple-600" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tighter max-w-3xl bg-gradient-to-r from-purple-600 to-blue-500 text-transparent bg-clip-text">
              AI-Powered Image Analysis for Estate Sales & Auctions
            </h1>
            <p className="text-muted-foreground md:text-xl max-w-[800px]">
              Upload images and get instant AI analysis to identify items, estimate values, and generate detailed reports.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mt-6">
              <Button asChild size="lg" className="bg-purple-600 hover:bg-purple-700 text-white">
                <a href="#upload">Start Analyzing</a>
              </Button>
              <Button variant="outline" asChild size="lg" className="border-purple-200 text-purple-700 hover:bg-purple-50">
                <Link to="/pricing">View Pricing</Link>
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="flex flex-col items-center text-center p-8 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow border border-gray-100">
              <div className="h-14 w-14 rounded-full bg-purple-100 flex items-center justify-center mb-6">
                <Zap className="h-7 w-7 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Instant Analysis</h3>
              <p className="text-muted-foreground">
                Upload images and get AI-powered analysis in seconds, no manual research needed.
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center p-8 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow border border-gray-100">
              <div className="h-14 w-14 rounded-full bg-blue-100 flex items-center justify-center mb-6">
                <FileText className="h-7 w-7 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Export Reports</h3>
              <p className="text-muted-foreground">
                Download detailed analysis reports in PDF or Excel format for your records.
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center p-8 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow border border-gray-100">
              <div className="h-14 w-14 rounded-full bg-indigo-100 flex items-center justify-center mb-6">
                <Shield className="h-7 w-7 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Secure & Private</h3>
              <p className="text-muted-foreground">
                Your images and data are processed securely and never shared with third parties.
              </p>
            </div>
          </div>
          
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-100 to-blue-100 rounded-3xl transform -skew-y-2 -z-10"></div>
            <div className="relative bg-white rounded-xl shadow-lg p-8 md:p-12 mb-16 border border-gray-100">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-blue-500 text-transparent bg-clip-text">How It Works</h2>
                  <p className="text-gray-600 mb-6">Our AI-powered platform makes it easy to identify and value items for estate sales and auctions.</p>
                  
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <div className="flex-shrink-0 h-6 w-6 rounded-full bg-purple-100 flex items-center justify-center mr-3 mt-0.5">
                        <span className="text-xs font-bold text-purple-700">1</span>
                      </div>
                      <div>
                        <p className="font-medium">Upload Images</p>
                        <p className="text-sm text-gray-500">Upload photos from your device or take pictures directly with your camera.</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center mr-3 mt-0.5">
                        <span className="text-xs font-bold text-blue-700">2</span>
                      </div>
                      <div>
                        <p className="font-medium">AI Analysis</p>
                        <p className="text-sm text-gray-500">Our AI processes your images to identify items and gather market data.</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="flex-shrink-0 h-6 w-6 rounded-full bg-indigo-100 flex items-center justify-center mr-3 mt-0.5">
                        <span className="text-xs font-bold text-indigo-700">3</span>
                      </div>
                      <div>
                        <p className="font-medium">Get Results</p>
                        <p className="text-sm text-gray-500">View detailed analysis and download reports in your preferred format.</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-r from-purple-500 to-blue-500 p-1 rounded-xl">
                  <div className="bg-white rounded-lg p-4">
                    <img 
                      src="https://images.unsplash.com/photo-1551305445-2e3a4c83c83b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80" 
                      alt="Estate sale items" 
                      className="rounded-lg w-full h-auto object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <section id="upload" className="py-12 md:py-16">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 mb-8">
            <div className="inline-block p-2 bg-purple-100 rounded-full mb-2">
              <Camera className="h-5 w-5 text-purple-600" />
            </div>
            <h2 className="text-3xl font-bold text-center bg-gradient-to-r from-purple-600 to-blue-500 text-transparent bg-clip-text">
              Start Your Image Analysis
            </h2>
            <p className="text-muted-foreground text-center max-w-[600px]">
              Upload images from your device or take photos directly with your camera.
            </p>
          </div>
          
          <ImageUploader />
          
          {isProcessing && (
            <div className="flex justify-center items-center my-8">
              <div className="relative">
                <div className="absolute inset-0 rounded-full bg-purple-100 animate-ping opacity-75"></div>
                <Loader2 className="h-8 w-8 animate-spin text-purple-600 relative z-10" />
              </div>
              <p className="ml-4 text-lg font-medium text-gray-700">Processing your images...</p>
            </div>
          )}
          
          {results.length > 0 && (
            <div className="mt-12">
              <ResultsViewer />
            </div>
          )}
        </div>
      </section>
      
      <section className="py-16 md:py-24 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/10 dark:to-blue-900/10">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 mb-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 text-transparent bg-clip-text">
              Ready to Streamline Your Estate Sale Process?
            </h2>
            <p className="text-muted-foreground max-w-[700px] text-lg">
              Sign up today and get full access to our AI-powered image analysis tools.
            </p>
            <Button asChild size="lg" className="mt-6 bg-purple-600 hover:bg-purple-700 text-white">
              <Link to="/signup">Get Started</Link>
            </Button>
            <p className="text-sm text-muted-foreground mt-4">
              No credit card required for free tier.
            </p>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default Index;