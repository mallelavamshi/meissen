import { useState, useEffect } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useUserStore } from "@/lib/stores/userStore";
import { Navigate } from "react-router";
import { Pencil, Trash, Plus, Save, X, Check, Loader2, Eye, EyeOff, AlertTriangle, Key } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";

// Define types for our data
interface User {
  id: string;
  email: string;
  role: string;
  subscription: string;
  lastLogin: string;
}

interface Subscription {
  id: string;
  name: string;
  price: string;
  features: string;
  active: boolean;
}

interface BlogPost {
  id: string;
  title: string;
  published: string;
  status: string;
}

interface Service {
  id: string;
  title: string;
  description: string;
  active: boolean;
}

interface Settings {
  imgbb_api_key?: string;
  searchapi_key?: string;
  deepseek_api_key?: string;
  company_name?: string;
  support_email?: string;
  max_upload_size?: string;
  [key: string]: string | undefined;
}

export default function AdminPage() {
  const { user } = useUserStore();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("users");
  const [isLoading, setIsLoading] = useState(false);
  const [loadingKey, setLoadingKey] = useState<string | null>(null);
  
  // State for different data types
  const [users, setUsers] = useState<User[]>([]);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [settings, setSettings] = useState<Settings>({});
  
  // State for API key editing
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [newKeyValue, setNewKeyValue] = useState("");
  const [showKeyValue, setShowKeyValue] = useState(false);
  const [apiKeyStatus, setApiKeyStatus] = useState<{[key: string]: boolean}>({
    imgbb_api_key: false,
    searchapi_key: false,
    deepseek_api_key: false
  });
  
  // Redirect if not admin
  if (!user || user.role !== "admin") {
    return <Navigate to="/" />;
  }
  
  // Load data based on active tab
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      
      try {
        let action;
        let endpoint;
        
        switch (activeTab) {
          case "users":
            action = "getUsers";
            endpoint = '/api/admin-operations';
            break;
          case "subscriptions":
            action = "getSubscriptions";
            endpoint = '/api/admin-operations';
            break;
          case "blog":
            action = "getContent";
            endpoint = '/api/admin-operations';
            break;
          case "services":
            action = "getContent";
            endpoint = '/api/admin-operations';
            break;
          default:
            action = "getUsers";
            endpoint = '/api/admin-operations';
        }
        
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            action,
            adminId: user.id,
            data: {
              type: activeTab === "blog" ? "blog" : 
                    activeTab === "services" ? "services" : undefined
            }
          }),
        });
        
        const data = await response.json();
        
        if (response.ok && data.success) {
          switch (activeTab) {
            case "users":
              setUsers(data.users || []);
              break;
            case "subscriptions":
              setSubscriptions(data.subscriptions || []);
              break;
            case "blog":
              setBlogs(data.content?.blog || []);
              break;
            case "services":
              setServices(data.content?.services || []);
              break;
          }
        } else {
          throw new Error(data.error || "Failed to load data");
        }
      } catch (error) {
        console.error(`Error loading ${activeTab} data:`, error);
        toast({
          title: "Error",
          description: `Failed to load ${activeTab} data. Please try again.`,
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, [activeTab]);
  
  const handleAction = async (action: string, type: string, id: string, data?: any) => {
    setIsLoading(true);
    
    try {
      let apiAction;
      let apiData = {};
      let endpoint = '/api/admin-operations';
      
      switch (action) {
        case "Edit":
          apiAction = type === "User" ? "updateUser" : 
                     type === "Subscription" ? "updateSubscription" :
                     type === "Blog Post" || type === "Service" ? "updateContent" : 
                     "updateSettings";
          
          if (type === "Settings") {
            endpoint = '/api/manage-settings';
          }
          
          apiData = {
            userId: type === "User" ? id : undefined,
            userData: type === "User" ? data : undefined,
            subscriptionId: type === "Subscription" ? id : undefined,
            subscriptionData: type === "Subscription" ? data : undefined,
            contentId: type === "Blog Post" || type === "Service" ? id : undefined,
            contentData: type === "Blog Post" || type === "Service" ? data : undefined,
            settings: type === "Settings" ? data : undefined
          };
          break;
          
        case "Delete":
          apiAction = type === "User" ? "deleteUser" : 
                     type === "Subscription" ? "deleteSubscription" :
                     "deleteContent";
          
          apiData = {
            userId: type === "User" ? id : undefined,
            subscriptionId: type === "Subscription" ? id : undefined,
            contentId: type === "Blog Post" || type === "Service" ? id : undefined
          };
          break;
          
        default:
          throw new Error("Invalid action");
      }
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: apiAction,
          adminId: user.id,
          data: apiData
        }),
      });
      
      const responseData = await response.json();
      
      if (response.ok && responseData.success) {
        toast({
          title: `${action} ${type}`,
          description: responseData.message || `Successfully ${action.toLowerCase()}ed ${type.toLowerCase()} with ID ${id}`
        });
        
        // Refresh the data
        setActiveTab(activeTab);
      } else {
        throw new Error(responseData.error || `Failed to ${action.toLowerCase()} ${type.toLowerCase()}`);
      }
    } catch (error) {
      console.error(`Error ${action.toLowerCase()}ing ${type.toLowerCase()}:`, error);
      toast({
        title: "Error",
        description: `Failed to ${action.toLowerCase()} ${type.toLowerCase()}. Please try again.`,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleUpdateApiKey = async (key: string) => {
    if (!newKeyValue) {
      toast({
        title: "Error",
        description: "API key cannot be empty",
        variant: "destructive"
      });
      return;
    }
    
    setLoadingKey(key);
    
    try {
      const response = await fetch('/api/manage-settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'updateApiKey',
          adminId: user.id,
          settings: {
            key,
            value: newKeyValue
          }
        }),
      });
      
      const data = await response.json();
      
      if (response.ok && data.success) {
        toast({
          title: "API Key Updated",
          description: data.message || `Successfully updated ${key}`
        });
        
        // Update API key status
        setApiKeyStatus(prev => ({
          ...prev,
          [key]: true
        }));
        
        // Reset state
        setEditingKey(null);
        setNewKeyValue("");
        setShowKeyValue(false);
        
        // Refresh settings
        const settingsResponse = await fetch('/api/manage-settings', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            action: 'getSettings',
            adminId: user.id
          }),
        });
        
        const settingsData = await settingsResponse.json();
        
        if (settingsResponse.ok && settingsData.success) {
          setSettings(settingsData.settings || {});
          if (settingsData.apiKeysSet) {
            setApiKeyStatus(settingsData.apiKeysSet);
          }
        }
      } else {
        throw new Error(data.error || "Failed to update API key");
      }
    } catch (error) {
      console.error("Error updating API key:", error);
      toast({
        title: "Error",
        description: "Failed to update API key. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoadingKey(null);
    }
  };
  
  const startEditingKey = (key: string) => {
    setEditingKey(key);
    setNewKeyValue("");
    setShowKeyValue(false);
  };
  
  const cancelEditingKey = () => {
    setEditingKey(null);
    setNewKeyValue("");
    setShowKeyValue(false);
  };
  
  return (
    <MainLayout>
      <div className="container max-w-7xl mx-auto py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-purple-600 to-blue-500 text-transparent bg-clip-text">Admin Dashboard</h1>
        </div>
        
        <Tabs defaultValue="users" value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="mb-8 bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-900/20 dark:to-blue-900/20 p-1 rounded-lg">
            <TabsTrigger value="users" className="data-[state=active]:bg-white data-[state=active]:text-purple-700 dark:data-[state=active]:bg-gray-800">Users</TabsTrigger>
            <TabsTrigger value="subscriptions" className="data-[state=active]:bg-white data-[state=active]:text-purple-700 dark:data-[state=active]:bg-gray-800">Subscriptions</TabsTrigger>
            <TabsTrigger value="blog" className="data-[state=active]:bg-white data-[state=active]:text-purple-700 dark:data-[state=active]:bg-gray-800">Blog</TabsTrigger>
            <TabsTrigger value="services" className="data-[state=active]:bg-white data-[state=active]:text-purple-700 dark:data-[state=active]:bg-gray-800">Services</TabsTrigger>
          </TabsList>
          
          <TabsContent value="users">
            <Card className="border-none shadow-lg">
              <CardHeader className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/10 dark:to-blue-900/10 rounded-t-lg">
                <CardTitle className="flex justify-between items-center">
                  <span>Manage Users</span>
                  <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                    <Plus className="h-4 w-4 mr-1" />
                    Add User
                  </Button>
                </CardTitle>
                <CardDescription>
                  View and manage user accounts
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                {isLoading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-50 dark:bg-gray-800/50">
                        <TableHead>Email</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Subscription</TableHead>
                        <TableHead>Last Login</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {users.length > 0 ? (
                        users.map((user) => (
                          <TableRow key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                            <TableCell className="font-medium">{user.email}</TableCell>
                            <TableCell>
                              <span className={`px-2 py-1 rounded-full text-xs ${
                                user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                              }`}>
                                {user.role}
                              </span>
                            </TableCell>
                            <TableCell>{user.subscription}</TableCell>
                            <TableCell>{user.lastLogin}</TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end space-x-2">
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => handleAction("Edit", "User", user.id)}
                                  className="hover:bg-purple-50 hover:text-purple-700"
                                >
                                  <Pencil className="h-4 w-4" />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => handleAction("Delete", "User", user.id)}
                                  className="hover:bg-red-50 hover:text-red-700"
                                >
                                  <Trash className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-4 text-muted-foreground">
                            No users found
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="subscriptions">
            <Card className="border-none shadow-lg">
              <CardHeader className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/10 dark:to-blue-900/10 rounded-t-lg">
                <CardTitle className="flex justify-between items-center">
                  <span>Manage Subscriptions</span>
                  <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                    <Plus className="h-4 w-4 mr-1" />
                    Add Plan
                  </Button>
                </CardTitle>
                <CardDescription>
                  Create and manage subscription plans
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                {isLoading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-50 dark:bg-gray-800/50">
                        <TableHead>Name</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Features</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {subscriptions.length > 0 ? (
                        subscriptions.map((sub) => (
                          <TableRow key={sub.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                            <TableCell className="font-medium">{sub.name}</TableCell>
                            <TableCell>{sub.price}</TableCell>
                            <TableCell>{sub.features}</TableCell>
                            <TableCell>
                              {sub.active ? (
                                <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                                  Active
                                </span>
                              ) : (
                                <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800">
                                  Inactive
                                </span>
                              )}
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end space-x-2">
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => handleAction("Edit", "Subscription", sub.id)}
                                  className="hover:bg-purple-50 hover:text-purple-700"
                                >
                                  <Pencil className="h-4 w-4" />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => handleAction("Delete", "Subscription", sub.id)}
                                  className="hover:bg-red-50 hover:text-red-700"
                                >
                                  <Trash className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-4 text-muted-foreground">
                            No subscription plans found
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="blog">
            <Card className="border-none shadow-lg">
              <CardHeader className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/10 dark:to-blue-900/10 rounded-t-lg">
                <CardTitle className="flex justify-between items-center">
                  <span>Manage Blog</span>
                  <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                    <Plus className="h-4 w-4 mr-1" />
                    New Post
                  </Button>
                </CardTitle>
                <CardDescription>
                  Create and manage blog posts
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                {isLoading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-50 dark:bg-gray-800/50">
                        <TableHead>Title</TableHead>
                        <TableHead>Published Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {blogs.length > 0 ? (
                        blogs.map((blog) => (
                          <TableRow key={blog.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                            <TableCell className="font-medium">{blog.title}</TableCell>
                            <TableCell>{blog.published}</TableCell>
                            <TableCell>
                              {blog.status === "Published" ? (
                                <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">Published
                                </span>
                              ) : (
                                <span className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800">
                                  Draft
                                </span>
                              )}
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end space-x-2">
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => handleAction("Edit", "Blog Post", blog.id)}
                                  className="hover:bg-purple-50 hover:text-purple-700"
                                >
                                  <Pencil className="h-4 w-4" />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => handleAction("Delete", "Blog Post", blog.id)}
                                  className="hover:bg-red-50 hover:text-red-700"
                                >
                                  <Trash className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={4} className="text-center py-4 text-muted-foreground">
                            No blog posts found
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="services">
            <Card className="border-none shadow-lg">
              <CardHeader className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/10 dark:to-blue-900/10 rounded-t-lg">
                <CardTitle className="flex justify-between items-center">
                  <span>Manage Services</span>
                  <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                    <Plus className="h-4 w-4 mr-1" />
                    Add Service
                  </Button>
                </CardTitle>
                <CardDescription>
                  Create and manage service offerings
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                {isLoading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-50 dark:bg-gray-800/50">
                        <TableHead>Title</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {services.length > 0 ? (
                        services.map((service) => (
                          <TableRow key={service.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                            <TableCell className="font-medium">{service.title}</TableCell>
                            <TableCell>{service.description}</TableCell>
                            <TableCell>
                              {service.active ? (
                                <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                                  Active
                                </span>
                              ) : (
                                <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800">
                                  Inactive
                                </span>
                              )}
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end space-x-2">
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => handleAction("Edit", "Service", service.id)}
                                  className="hover:bg-purple-50 hover:text-purple-700"
                                >
                                  <Pencil className="h-4 w-4" />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => handleAction("Delete", "Service", service.id)}
                                  className="hover:bg-red-50 hover:text-red-700"
                                >
                                  <Trash className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={4} className="text-center py-4 text-muted-foreground">
                            No services found
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
        </Tabs>
      </div>
    </MainLayout>
  );
}