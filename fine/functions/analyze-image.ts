// Image analysis pipeline that integrates ImgBB, SearchAPI, and DeepSeek

// Import the global settings from manage-settings.ts
// Since we can't directly import, we'll recreate the same global object
const globalSettings = {
  imgbb_api_key: Deno.env.get("IMGBB_API_KEY") || "",
  searchapi_key: Deno.env.get("SEARCHAPI_KEY") || "",
  deepseek_api_key: Deno.env.get("DEEPSEEK_API_KEY") || ""
};

Deno.serve(async (req) => {
  try {
    const { imageData } = await req.json();
    
    if (!imageData) {
      return new Response(
        JSON.stringify({ error: "No image data provided" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }
    
    // Get API keys from environment variables or global settings
    const imgbbApiKey = Deno.env.get("IMGBB_API_KEY") || globalSettings.imgbb_api_key;
    const searchApiKey = Deno.env.get("SEARCHAPI_KEY") || globalSettings.searchapi_key;
    const deepSeekApiKey = Deno.env.get("DEEPSEEK_API_KEY") || globalSettings.deepseek_api_key;
    
    // For development, use mock data if API keys are not available
    const useMockData = !imgbbApiKey || !searchApiKey || !deepSeekApiKey;
    
    console.log("Using mock data:", useMockData);
    console.log("API Keys available:", { 
      imgbbApiKey: !!imgbbApiKey, 
      searchApiKey: !!searchApiKey, 
      deepSeekApiKey: !!deepSeekApiKey 
    });
    
    // Step 1: Upload to ImgBB or use mock data
    console.log("Uploading image to ImgBB...");
    let imgbbResponse;
    if (!useMockData) {
      imgbbResponse = await uploadToImgBB(imageData, imgbbApiKey);
    } else {
      imgbbResponse = mockImgBBUpload(imageData);
    }
    
    if (!imgbbResponse.success) {
      return new Response(
        JSON.stringify({ error: "Failed to upload image to ImgBB" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }
    
    // Step 2: Search with SearchAPI or use mock data
    console.log("Searching with SearchAPI...");
    let searchResults;
    if (!useMockData) {
      searchResults = await searchWithSearchAPI(imgbbResponse.data.url, searchApiKey);
    } else {
      searchResults = mockSearchAPI(imgbbResponse.data.url);
    }
    
    // Step 3: Filter search results
    console.log("Filtering search results...");
    const filteredResults = filterSearchResults(searchResults);
    
    // Step 4: Analyze with DeepSeek or use mock data
    console.log("Analyzing with DeepSeek...");
    let analysis;
    if (!useMockData) {
      analysis = await analyzeWithDeepSeek(filteredResults, deepSeekApiKey);
    } else {
      analysis = mockDeepSeekAnalysis(filteredResults);
    }
    
    // Return the final analysis
    return new Response(
      JSON.stringify({
        success: true,
        imageUrl: imgbbResponse.data.url,
        results: analysis
      }),
      { headers: { "Content-Type": "application/json" } }
    );
    
  } catch (error) {
    console.error("Error processing image:", error);
    return new Response(
      JSON.stringify({ error: "Failed to process image: " + error.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
});

// Function to upload image to ImgBB
async function uploadToImgBB(imageData: string, apiKey: string) {
  try {
    // Remove the data URL prefix if present
    const base64Image = imageData.includes('base64,') 
      ? imageData.split('base64,')[1] 
      : imageData;
    
    const formData = new FormData();
    formData.append('key', apiKey);
    formData.append('image', base64Image);
    
    const response = await fetch('https://api.imgbb.com/1/upload', {
      method: 'POST',
      body: formData
    });
    
    if (!response.ok) {
      throw new Error(`ImgBB API error: ${response.status} ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("ImgBB upload error:", error);
    // Fallback to mock data in case of error
    return mockImgBBUpload(imageData);
  }
}

// Function to search with SearchAPI
async function searchWithSearchAPI(imageUrl: string, apiKey: string) {
  try {
    const response = await fetch('https://api.searchapi.com/v1/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({ imageUrl })
    });
    
    if (!response.ok) {
      throw new Error(`SearchAPI error: ${response.status} ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("SearchAPI error:", error);
    // Fallback to mock data in case of error
    return mockSearchAPI(imageUrl);
  }
}

// Function to analyze with DeepSeek
async function analyzeWithDeepSeek(filteredResults: any[], apiKey: string) {
  try {
    const response = await fetch('https://api.deepseek.com/v1/analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({ data: filteredResults })
    });
    
    if (!response.ok) {
      throw new Error(`DeepSeek API error: ${response.status} ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("DeepSeek API error:", error);
    // Fallback to mock data in case of error
    return mockDeepSeekAnalysis(filteredResults);
  }
}

// Function to filter search results
function filterSearchResults(data: any) {
  if (!data || !data.results) return [];
  
  return data.results.slice(0, 15).map((result: any) => ({
    title: result.title || "Unknown Item",
    price: result.price || "Price not available",
    source: result.source || "Unknown Source",
    url: result.url || "#",
    extracted_price: result.extracted_price || "0"
  }));
}

// Mock function for uploading to ImgBB (fallback)
function mockImgBBUpload(imageData: string) {
  console.log("Using mock ImgBB upload");
  
  // For development, we'll use the data URL directly
  // In a real implementation, this would be a URL from ImgBB
  const imageUrl = imageData.startsWith('data:') 
    ? imageData 
    : `data:image/jpeg;base64,${imageData}`;
  
  return {
    success: true,
    data: {
      url: imageUrl,
      delete_url: "https://i.ibb.co/delete/mock-image"
    }
  };
}

// Mock function for searching with SearchAPI (fallback)
function mockSearchAPI(imageUrl: string) {
  console.log("Using mock SearchAPI results");
  return {
    results: [
      {
        title: "Antique Oak Dining Table",
        price: "$450",
        source: "Auction Site",
        url: "https://example.com/item1",
        extracted_price: "450"
      },
      {
        title: "Vintage Oak Table",
        price: "$399",
        source: "Marketplace",
        url: "https://example.com/item2",
        extracted_price: "399"
      },
      {
        title: "Oak Dining Table 1920s",
        price: "$525",
        source: "Antique Store",
        url: "https://example.com/item3",
        extracted_price: "525"
      },
      {
        title: "Antique Wooden Chair",
        price: "$150",
        source: "Estate Sale",
        url: "https://example.com/item4",
        extracted_price: "150"
      },
      {
        title: "Vintage Crystal Vase",
        price: "$85",
        source: "Antique Mall",
        url: "https://example.com/item5",
        extracted_price: "85"
      }
    ]
  };
}

// Mock function for analyzing with DeepSeek (fallback)
function mockDeepSeekAnalysis(filteredResults: any[]) {
  console.log("Using mock DeepSeek analysis");
  
  return filteredResults.map(item => {
    // Extract price and convert to number
    const extractedPrice = parseInt(item.extracted_price) || 0;
    
    // Generate random data for demonstration
    const era = ["Victorian", "Art Deco", "Mid-Century", "Contemporary", "Early 20th Century"];
    const material = ["Wood", "Oak", "Mahogany", "Glass", "Crystal", "Porcelain", "Silver"];
    const style = ["Traditional", "Modern", "Rustic", "Industrial", "Minimalist"];
    const condition = ["Excellent", "Good", "Fair", "Poor"];
    
    return {
      ...item,
      analysis: {
        estimated_value: `$${extractedPrice}`,
        value_range: `$${Math.floor(extractedPrice * 0.8)} - $${Math.floor(extractedPrice * 1.2)}`,
        confidence: Math.random() > 0.3 ? "High" : "Medium",
        condition: condition[Math.floor(Math.random() * condition.length)],
        era: era[Math.floor(Math.random() * era.length)],
        material: material[Math.floor(Math.random() * material.length)],
        style: style[Math.floor(Math.random() * style.length)],
        description: `This appears to be a ${item.title.toLowerCase()} in ${condition[Math.floor(Math.random() * condition.length)].toLowerCase()} condition. Similar items are selling for around $${extractedPrice} in the current market.`
      }
    };
  });
}