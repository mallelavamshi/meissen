import { useState } from "react";
import { Download, FileSpreadsheet, FileText, ExternalLink, Loader2, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAnalysisStore, AnalysisResult } from "@/lib/stores/analysisStore";
import { useUserStore } from "@/lib/stores/userStore";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

export function ResultsViewer() {
  const { results } = useAnalysisStore();
  const { user } = useUserStore();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("all");
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [isGeneratingExcel, setIsGeneratingExcel] = useState(false);
  
  if (results.length === 0) {
    return null;
  }
  
  const downloadPDF = async (result?: AnalysisResult) => {
    setIsGeneratingPDF(true);
    
    try {
      const dataToExport = result ? [result] : results;
      
      const response = await fetch('/api/generate-report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          results: dataToExport,
          format: 'pdf',
          userInfo: user ? {
            id: user.id,
            email: user.email,
            subscription: user.subscription
          } : null
        }),
      });
      
      const data = await response.json();
      
      if (response.ok && data.success) {
        toast({
          title: "PDF Generated",
          description: "Your PDF report is ready for download."
        });
        
        // In a real implementation, we would trigger the download here
        // For now, we'll just show a success message
        console.log("PDF download URL:", data.downloadUrl);
      } else {
        throw new Error(data.error || "Failed to generate PDF");
      }
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast({
        title: "Error",
        description: "Failed to generate PDF. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGeneratingPDF(false);
    }
  };
  
  const downloadExcel = async (result?: AnalysisResult) => {
    setIsGeneratingExcel(true);
    
    try {
      const dataToExport = result ? [result] : results;
      
      const response = await fetch('/api/generate-report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          results: dataToExport,
          format: 'excel',
          userInfo: user ? {
            id: user.id,
            email: user.email,
            subscription: user.subscription
          } : null
        }),
      });
      
      const data = await response.json();
      
      if (response.ok && data.success) {
        toast({
          title: "Excel Generated",
          description: "Your Excel report is ready for download."
        });
        
        // In a real implementation, we would trigger the download here
        // For now, we'll just show a success message
        console.log("Excel download URL:", data.downloadUrl);
      } else {
        throw new Error(data.error || "Failed to generate Excel");
      }
    } catch (error) {
      console.error("Error generating Excel:", error);
      toast({
        title: "Error",
        description: "Failed to generate Excel. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGeneratingExcel(false);
    }
  };
  
  const ResultCard = ({ result }: { result: AnalysisResult }) => (
    <Card className="mb-6 border-none shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-purple-500 to-blue-500 h-1"></div>
      <CardHeader className="pb-2 pt-6">
        <CardTitle className="text-lg flex justify-between items-center">
          <span className="bg-gradient-to-r from-purple-600 to-blue-500 text-transparent bg-clip-text">Analysis Results</span>
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => downloadPDF(result)}
              disabled={isGeneratingPDF}
              className="border-purple-200 text-purple-700 hover:bg-purple-50"
            >
              {isGeneratingPDF ? (
                <Loader2 className="h-4 w-4 mr-1 animate-spin" />
              ) : (
                <FileText className="h-4 w-4 mr-1" />
              )}
              PDF
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => downloadExcel(result)}
              disabled={isGeneratingExcel}
              className="border-purple-200 text-purple-700 hover:bg-purple-50"
            >
              {isGeneratingExcel ? (
                <Loader2 className="h-4 w-4 mr-1 animate-spin" />
              ) : (
                <FileSpreadsheet className="h-4 w-4 mr-1" />
              )}
              Excel
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => window.open(result.url, "_blank")}
              className="border-purple-200 text-purple-700 hover:bg-purple-50"
            >
              <ExternalLink className="h-4 w-4 mr-1" />
              View Source
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="aspect-square md:aspect-auto">
            <div className="rounded-lg overflow-hidden border border-gray-200 shadow-sm">
              <img 
                src={result.imageUrl} 
                alt="Analyzed item" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          <div className="md:col-span-2">
            <h3 className="font-medium mb-4 text-lg flex items-center">
              <Info className="h-4 w-4 text-purple-600 mr-2" />
              Identified Items
            </h3>
            <div className="space-y-4">
              {result.results && result.results.length > 0 ? (
                result.results.map((item, idx) => (
                  <div key={idx} className="border rounded-lg p-4 hover:shadow-md transition-shadow bg-white">
                    <h4 className="font-medium text-lg mb-2">{item.title}</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-3">
                      <div>
                        {item.price && (
                          <p className="text-sm flex justify-between">
                            <span className="text-gray-500">Price:</span> 
                            <span className="font-medium text-purple-700">{item.price}</span>
                          </p>
                        )}
                        {item.source && (
                          <p className="text-sm flex justify-between">
                            <span className="text-gray-500">Source:</span> 
                            <span>{item.source}</span>
                          </p>
                        )}
                      </div>
                      
                      {item.analysis && (
                        <div>
                          {item.analysis.estimated_value && (
                            <p className="text-sm flex justify-between">
                              <span className="text-gray-500">Est. Value:</span>
                              <span className="font-medium text-green-600">{item.analysis.estimated_value}</span>
                            </p>
                          )}
                          {item.analysis.condition && (
                            <p className="text-sm flex justify-between">
                              <span className="text-gray-500">Condition:</span>
                              <span>{item.analysis.condition}</span>
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                    
                    {item.analysis && (
                      <div className="mt-3 pt-3 border-t border-dashed">
                        <div className="flex flex-wrap gap-2 mb-3">
                          {item.analysis.era && (
                            <Badge variant="outline" className="bg-purple-50 text-purple-700 hover:bg-purple-100 border-purple-200">
                              {item.analysis.era}
                            </Badge>
                          )}
                          {item.analysis.material && (
                            <Badge variant="outline" className="bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-200">
                              {item.analysis.material}
                            </Badge>
                          )}
                          {item.analysis.style && (
                            <Badge variant="outline" className="bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border-indigo-200">
                              {item.analysis.style}
                            </Badge>
                          )}
                          {item.analysis.confidence && (
                            <Badge variant="outline" className={`
                              ${item.analysis.confidence === 'High' 
                                ? 'bg-green-50 text-green-700 hover:bg-green-100 border-green-200' 
                                : 'bg-yellow-50 text-yellow-700 hover:bg-yellow-100 border-yellow-200'}
                            `}>
                              {item.analysis.confidence} Confidence
                            </Badge>
                          )}
                        </div>
                        
                        {item.analysis.description && (
                          <p className="text-sm text-gray-600 italic">
                            "{item.analysis.description}"
                          </p>
                        )}
                      </div>
                    )}
                    
                    {item.url && (
                      <div className="mt-3 pt-3 border-t">
                        <a 
                          href={item.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-sm text-purple-600 flex items-center hover:text-purple-800 transition-colors"
                        >
                          View Similar Items <ExternalLink className="h-3 w-3 ml-1" />
                        </a>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center p-6 border rounded-md bg-gray-50">
                  <p className="text-muted-foreground">No items identified in this image.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
  
  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 text-transparent bg-clip-text">Analysis Results</h2>
        <div className="flex space-x-3">
          <Button 
            variant="outline" 
            onClick={() => downloadPDF()}
            disabled={isGeneratingPDF}
            className="border-purple-200 text-purple-700 hover:bg-purple-50"
          >
            {isGeneratingPDF ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <FileText className="h-4 w-4 mr-2" />
            )}
            Download PDF
          </Button>
          <Button 
            variant="outline" 
            onClick={() => downloadExcel()}
            disabled={isGeneratingExcel}
            className="border-purple-200 text-purple-700 hover:bg-purple-50"
          >
            {isGeneratingExcel ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <FileSpreadsheet className="h-4 w-4 mr-2" />
            )}
            Download Excel
          </Button>
        </div>
      </div>
      
      <Tabs 
        defaultValue="all" 
        value={activeTab} 
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList className="mb-4 bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-900/20 dark:to-blue-900/20 p-1 rounded-lg">
          <TabsTrigger 
            value="all" 
            className="data-[state=active]:bg-white data-[state=active]:text-purple-700 dark:data-[state=active]:bg-gray-800"
          >
            All Results ({results.length})
          </TabsTrigger>
          {results.length > 0 && (
            <TabsTrigger 
              value="latest" 
              className="data-[state=active]:bg-white data-[state=active]:text-purple-700 dark:data-[state=active]:bg-gray-800"
            >
              Latest Result
            </TabsTrigger>
          )}
        </TabsList>
        
        <TabsContent value="all" className="space-y-6">
          {results.map((result) => (
            <ResultCard key={result.id} result={result} />
          ))}
        </TabsContent>
        
        <TabsContent value="latest">
          {results.length > 0 && (
            <ResultCard result={results[results.length - 1]} />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}