import { useState, useEffect } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useUserStore } from "@/lib/stores/userStore";
import { useAnalysisStore, AnalysisResult } from "@/lib/stores/analysisStore";
import { Link, Navigate } from "react-router";
import { FileText, FileSpreadsheet, Clock, Image, BarChart3, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function DashboardPage() {
  const { user, updateUser } = useUserStore();
  const { results } = useAnalysisStore();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("overview");
  const [subscription, setSubscription] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // Redirect if not logged in
  if (!user) {
    return <Navigate to="/login" />;
  }
  
  // Fetch subscription details
  useEffect(() => {
    if (activeTab === "subscription") {
      const fetchSubscription = async () => {
        setIsLoading(true);
        
        try {
          const response = await fetch('/api/manage-subscription', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              action: 'get',
              userId: user.id
            }),
          });
          
          const data = await response.json();
          
          if (response.ok && data.success) {
            setSubscription(data.subscription);
          } else {
            throw new Error(data.error || "Failed to fetch subscription details");
          }
        } catch (error) {
          console.error("Error fetching subscription:", error);
          toast({
            title: "Error",
            description: "Failed to load subscription details. Please try again.",
            variant: "destructive"
          });
        } finally {
          setIsLoading(false);
        }
      };
      
      fetchSubscription();
    }
  }, [activeTab]);
  
  const handleCancelSubscription = async () => {
    if (!confirm("Are you sure you want to cancel your subscription? You will be downgraded to the free plan.")) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/manage-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'cancel',
          userId: user.id
        }),
      });
      
      const data = await response.json();
      
      if (response.ok && data.success) {
        toast({
          title: "Subscription Cancelled",
          description: data.message || "Your subscription has been cancelled successfully."
        });
        
        // Update local user state
        updateUser({
          subscription: "Free"
        });
        
        // Update subscription state
        setSubscription(data.subscription);
      } else {
        throw new Error(data.error || "Failed to cancel subscription");
      }
    } catch (error) {
      console.error("Error cancelling subscription:", error);
      toast({
        title: "Error",
        description: "Failed to cancel subscription. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Mock data for the dashboard
  const recentAnalyses = results.slice(-5).reverse();
  const totalAnalyses = results.length;
  const usageLimit = user.subscription === "Free" ? 15 : "Unlimited";
  const sessionsLimit = user.subscription === "Free" ? 3 : "Unlimited";
  
  return (
    <MainLayout>
      <div className="container py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome back, {user.email}
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <Button asChild>
              <Link to="/">New Analysis</Link>
            </Button>
          </div>
        </div>
        
        <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-8">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="history">Analysis History</TabsTrigger>
            <TabsTrigger value="subscription">Subscription</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Analyses
                  </CardTitle>
                  <BarChart3 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalAnalyses}</div>
                  <p className="text-xs text-muted-foreground">
                    Lifetime analyses
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Today's Usage
                  </CardTitle>
                  <Image className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{user.usageToday} / {usageLimit}</div>
                  <p className="text-xs text-muted-foreground">
                    Images analyzed today
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Sessions Today
                  </CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{user.sessionsToday} / {sessionsLimit}</div>
                  <p className="text-xs text-muted-foreground">
                    Analysis sessions today
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Subscription
                  </CardTitle>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    className="h-4 w-4 text-muted-foreground"
                  >
                    <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                  </svg>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{user.subscription}</div>
                  <p className="text-xs text-muted-foreground">
                    Current plan
                  </p>
                </CardContent>
              </Card>
            </div>
            
            <div className="mt-8">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Analyses</CardTitle>
                  <CardDescription>
                    Your most recent image analyses
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {recentAnalyses.length > 0 ? (
                    <div className="space-y-4">
                      {recentAnalyses.map((analysis, index) => (
                        <div key={index} className="flex items-center space-x-4">
                          <div className="h-16 w-16 rounded-md overflow-hidden">
                            <img 
                              src={analysis.imageUrl} 
                              alt="Analysis thumbnail" 
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium">
                              Analysis #{totalAnalyses - index}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {new Date(analysis.timestamp).toLocaleString()}
                            </p>
                          </div>
                          <div className="flex space-x-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => {
                                fetch('/api/generate-report', {
                                  method: 'POST',
                                  headers: {
                                    'Content-Type': 'application/json',
                                  },
                                  body: JSON.stringify({
                                    results: [analysis],
                                    format: 'pdf',
                                    userInfo: {
                                      id: user.id,
                                      email: user.email,
                                      subscription: user.subscription
                                    }
                                  }),
                                })
                                .then(response => response.json())
                                .then(data => {
                                  if (data.success) {
                                    toast({
                                      title: "PDF Generated",
                                      description: "Your PDF report is ready for download."
                                    });
                                  } else {
                                    throw new Error(data.error);
                                  }
                                })
                                .catch(error => {
                                  toast({
                                    title: "Error",
                                    description: "Failed to generate PDF. Please try again.",
                                    variant: "destructive"
                                  });
                                });
                              }}
                            >
                              <FileText className="h-4 w-4 mr-1" />
                              PDF
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => {
                                fetch('/api/generate-report', {
                                  method: 'POST',
                                  headers: {
                                    'Content-Type': 'application/json',
                                  },
                                  body: JSON.stringify({
                                    results: [analysis],
                                    format: 'excel',
                                    userInfo: {
                                      id: user.id,
                                      email: user.email,
                                      subscription: user.subscription
                                    }
                                  }),
                                })
                                .then(response => response.json())
                                .then(data => {
                                  if (data.success) {
                                    toast({
                                      title: "Excel Generated",
                                      description: "Your Excel report is ready for download."
                                    });
                                  } else {
                                    throw new Error(data.error);
                                  }
                                })
                                .catch(error => {
                                  toast({
                                    title: "Error",
                                    description: "Failed to generate Excel. Please try again.",
                                    variant: "destructive"
                                  });
                                });
                              }}
                            >
                              <FileSpreadsheet className="h-4 w-4 mr-1" />
                              Excel
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">No analyses yet</p>
                      <Button asChild className="mt-4">
                        <Link to="/">Start Your First Analysis</Link>
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="history">
            <Card>
              <CardHeader>
                <CardTitle>Analysis History</CardTitle>
                <CardDescription>
                  All your previous image analyses
                </CardDescription>
              </CardHeader>
              <CardContent>
                {results.length > 0 ? (
                  <div className="space-y-4">
                    {[...results].reverse().map((analysis, index) => (
                      <div key={index} className="flex items-center space-x-4 border-b pb-4 last:border-0">
                        <div className="h-16 w-16 rounded-md overflow-hidden">
                          <img 
                            src={analysis.imageUrl} 
                            alt="Analysis thumbnail" 
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">
                            Analysis #{totalAnalyses - index}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(analysis.timestamp).toLocaleString()}
                          </p>
                          <p className="text-sm">
                            {analysis.results.length} items identified
                          </p>
                        </div>
                        <div className="flex space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => {
                              fetch('/api/generate-report', {
                                method: 'POST',
                                headers: {
                                  'Content-Type': 'application/json',
                                },
                                body: JSON.stringify({
                                  results: [analysis],
                                  format: 'pdf',
                                  userInfo: {
                                    id: user.id,
                                    email: user.email,
                                    subscription: user.subscription
                                  }
                                }),
                              })
                              .then(response => response.json())
                              .then(data => {
                                if (data.success) {
                                  toast({
                                    title: "PDF Generated",
                                    description: "Your PDF report is ready for download."
                                  });
                                } else {
                                  throw new Error(data.error);
                                }
                              })
                              .catch(error => {
                                toast({
                                  title: "Error",
                                  description: "Failed to generate PDF. Please try again.",
                                  variant: "destructive"
                                });
                              });
                            }}
                          >
                            <FileText className="h-4 w-4 mr-1" />
                            PDF
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => {
                              fetch('/api/generate-report', {
                                method: 'POST',
                                headers: {
                                  'Content-Type': 'application/json',
                                },
                                body: JSON.stringify({
                                  results: [analysis],
                                  format: 'excel',
                                  userInfo: {
                                    id: user.id,
                                    email: user.email,
                                    subscription: user.subscription
                                  }
                                }),
                              })
                              .then(response => response.json())
                              .then(data => {
                                if (data.success) {
                                  toast({
                                    title: "Excel Generated",
                                    description: "Your Excel report is ready for download."
                                  });
                                } else {
                                  throw new Error(data.error);
                                }
                              })
                              .catch(error => {
                                toast({
                                  title: "Error",
                                  description: "Failed to generate Excel. Please try again.",
                                  variant: "destructive"
                                });
                              });
                            }}
                          >
                            <FileSpreadsheet className="h-4 w-4 mr-1" />
                            Excel
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No analyses yet</p>
                    <Button asChild className="mt-4">
                      <Link to="/">Start Your First Analysis</Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="subscription">
            <Card>
              <CardHeader>
                <CardTitle>Your Subscription</CardTitle>
                <CardDescription>
                  Manage your subscription and billing
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="bg-muted p-4 rounded-lg">
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="font-medium">Current Plan: {user.subscription}</h3>
                          <p className="text-sm text-muted-foreground mt-1">
                            {user.subscription === "Free" 
                              ? "Limited to 15 images per session, 3 sessions per day" 
                              : "Unlimited images and sessions"}
                          </p>
                        </div>
                        {user.subscription === "Free" && (
                          <Button asChild>
                            <Link to="/pricing">Upgrade</Link>
                          </Button>
                        )}
                      </div>
                    </div>
                    
                    {user.subscription !== "Free" && subscription && (
                      <div className="space-y-4">
                        <h3 className="font-medium">Billing Information</h3>
                        <div className="grid gap-2">
                          <div className="flex justify-between py-2 border-b">
                            <span className="text-muted-foreground">Plan</span>
                            <span>{subscription.name}</span>
                          </div>
                          <div className="flex justify-between py-2 border-b">
                            <span className="text-muted-foreground">Billing Cycle</span>
                            <span>Monthly</span>
                          </div>
                          <div className="flex justify-between py-2 border-b">
                            <span className="text-muted-foreground">Next Billing Date</span>
                            <span>{new Date(subscription.nextBillingDate).toLocaleDateString()}</span>
                          </div>
                          <div className="flex justify-between py-2">
                            <span className="text-muted-foreground">Payment Method</span>
                            <span>Visa ending in 4242</span>
                          </div>
                        </div>
                        
                        <div className="flex space-x-4 mt-6">
                          <Button variant="outline">Update Payment Method</Button>
                          <Button 
                            variant="outline" 
                            className="text-destructive"
                            onClick={handleCancelSubscription}
                            disabled={isLoading}
                          >
                            {isLoading ? (
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            ) : null}
                            Cancel Subscription
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}