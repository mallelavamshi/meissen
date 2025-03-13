import { useState, useRef, ChangeEvent } from "react";
import { Upload, Camera, X, Loader2, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useUserStore } from "@/lib/stores/userStore";
import { useAnalysisStore } from "@/lib/stores/analysisStore";
import { useToast } from "@/hooks/use-toast";
import { v4 as uuidv4 } from "uuid";

export function ImageUploader() {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [currentFileIndex, setCurrentFileIndex] = useState(0);
  const [totalFiles, setTotalFiles] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  
  const { user, updateUsage } = useUserStore();
  const { setProcessing, setCurrentBatch, addResult, setError } = useAnalysisStore();
  
  const FREE_TIER_LIMIT = 15;
  const FREE_TIER_SESSIONS = 3;
  
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    
    const files = Array.from(e.target.files);
    
    // Check if user has reached the limit
    if (!user && files.length + selectedFiles.length > FREE_TIER_LIMIT) {
      toast({
        title: "Free tier limit",
        description: `You can only upload up to ${FREE_TIER_LIMIT} images at a time. Please sign up for more.`,
        variant: "destructive"
      });
      return;
    }
    
    // Check if user has reached the session limit
    if (!user && (user?.sessionsToday || 0) >= FREE_TIER_SESSIONS) {
      toast({
        title: "Daily limit reached",
        description: "You've reached your daily limit. Please sign up for unlimited access.",
        variant: "destructive"
      });
      return;
    }
    
    // Create preview URLs
    const newPreviewUrls = files.map(file => URL.createObjectURL(file));
    
    setSelectedFiles(prev => [...prev, ...files]);
    setPreviewUrls(prev => [...prev, ...newPreviewUrls]);
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };
  
  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    
    // Revoke the object URL to avoid memory leaks
    URL.revokeObjectURL(previewUrls[index]);
    setPreviewUrls(prev => prev.filter((_, i) => i !== index));
  };
  
  const handleCameraCapture = () => {
    if (fileInputRef.current) {
      fileInputRef.current.accept = "image/*";
      fileInputRef.current.capture = "environment";
      fileInputRef.current.click();
    }
  };
  
  const handleGalleryUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.accept = "image/*";
      fileInputRef.current.removeAttribute("capture");
      fileInputRef.current.click();
    }
  };
  
  const processImages = async () => {
    if (selectedFiles.length === 0) return;
    
    setIsUploading(true);
    setProcessing(true);
    setCurrentBatch(previewUrls);
    setTotalFiles(selectedFiles.length);
    setCurrentFileIndex(0);
    
    try {
      // Track usage for authenticated users
      if (user) {
        updateUsage(selectedFiles.length);
      }
      
      // Process each image
      for (let i = 0; i < selectedFiles.length; i++) {
        setCurrentFileIndex(i + 1);
        const file = selectedFiles[i];
        
        try {
          // Convert file to base64
          const reader = new FileReader();
          
          const imageDataPromise = new Promise<string>((resolve) => {
            reader.onloadend = () => {
              const base64data = reader.result as string;
              resolve(base64data);
            };
          });
          
          reader.readAsDataURL(file);
          const imageData = await imageDataPromise;
          
          // Call our backend function to analyze the image
          const response = await fetch('/api/analyze-image', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ imageData }),
          });
          
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          
          const data = await response.json();
          
          if (data.success) {
            // Add the result to our store
            addResult({
              id: uuidv4(),
              imageUrl: data.imageUrl || previewUrls[i], // Use the returned URL or fallback to preview
              results: data.results,
              timestamp: new Date().toISOString()
            });
            
            toast({
              title: "Analysis complete",
              description: `Successfully analyzed image ${i + 1} of ${selectedFiles.length}.`
            });
          } else {
            throw new Error(data.error || 'Failed to analyze image');
          }
        } catch (error) {
          console.error(`Error processing image ${i + 1}:`, error);
          toast({
            title: "Processing Error",
            description: `Failed to process image ${i + 1}. Please try again.`,
            variant: "destructive"
          });
        }
      }
    } catch (error) {
      console.error("Error processing images:", error);
      setError("Failed to process images. Please try again.");
      toast({
        title: "Error",
        description: "Failed to process images. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
      setProcessing(false);
      setSelectedFiles([]);
      setPreviewUrls([]);
    }
  };
  
  return (
    <div className="w-full max-w-3xl mx-auto">
      <Card className="border-none shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-purple-500 to-blue-500 h-2"></div>
        <CardContent className="p-8">
          <div className="flex flex-col items-center justify-center space-y-6">
            <div className="text-center space-y-2">
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-purple-100 mx-auto mb-4">
                <ImageIcon className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold">Upload Images for Analysis</h3>
              <p className="text-sm text-muted-foreground">
                Upload up to {user ? "unlimited" : FREE_TIER_LIMIT} images for AI analysis
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-4 w-full max-w-md">
              <Button 
                variant="outline" 
                className="h-28 flex flex-col gap-3 border-2 border-dashed border-gray-200 hover:border-purple-300 hover:bg-purple-50"
                onClick={handleGalleryUpload}
                disabled={isUploading}
              >
                <Upload className="h-6 w-6 text-purple-600" />
                <span className="font-medium">Upload from Gallery</span>
              </Button>
              
              <Button 
                variant="outline" 
                className="h-28 flex flex-col gap-3 border-2 border-dashed border-gray-200 hover:border-purple-300 hover:bg-purple-50"
                onClick={handleCameraCapture}
                disabled={isUploading}
              >
                <Camera className="h-6 w-6 text-purple-600" />
                <span className="font-medium">Take a Photo</span>
              </Button>
            </div>
            
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              multiple
              accept="image/*"
            />
            
            {previewUrls.length > 0 && !isUploading && (
              <div className="w-full">
                <h4 className="text-sm font-medium mb-3 text-gray-700">Selected Images ({previewUrls.length})</h4>
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                  {previewUrls.map((url, index) => (
                    <div key={index} className="relative group aspect-square rounded-lg overflow-hidden border border-gray-200">
                      <img
                        src={url}
                        alt={`Preview ${index}`}
                        className="w-full h-full object-cover transition-transform group-hover:scale-105"
                      />
                      <button
                        onClick={() => removeFile(index)}
                        className="absolute top-1 right-1 bg-black/70 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-3 w-3 text-white" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {isUploading && (
              <div className="w-full text-center py-4">
                <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-purple-100 mb-4">
                  <Loader2 className="h-6 w-6 animate-spin text-purple-600" />
                </div>
                <p className="text-sm font-medium text-gray-700">
                  Processing image {currentFileIndex} of {totalFiles}...
                </p>
                <div className="w-full bg-gray-200 rounded-full h-2.5 mt-3 max-w-md mx-auto">
                  <div 
                    className="bg-gradient-to-r from-purple-500 to-blue-500 h-2.5 rounded-full" 
                    style={{ width: `${(currentFileIndex / totalFiles) * 100}%` }}
                  ></div>
                </div>
              </div>
            )}
            
            {selectedFiles.length > 0 && !isUploading && (
              <Button 
                onClick={processImages} 
                disabled={isUploading}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
                size="lg"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  `Analyze ${selectedFiles.length} Image${selectedFiles.length > 1 ? 's' : ''}`
                )}
              </Button>
            )}
            
            {!user && (
              <div className="text-center mt-4 p-3 bg-gray-50 rounded-lg border border-gray-100">
                <p className="text-xs text-muted-foreground">
                  <span className="font-medium text-purple-700">Free tier:</span> {FREE_TIER_LIMIT} images per session, {FREE_TIER_SESSIONS} sessions per day.
                </p>
                <p className="text-xs mt-1">
                  <a href="/signup" className="text-purple-600 hover:underline font-medium">Sign up</a> for unlimited access.
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}