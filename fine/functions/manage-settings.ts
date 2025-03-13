// Function to handle settings management

// Create a global store for settings that persists across function calls
const globalSettings = {
  imgbb_api_key: Deno.env.get("IMGBB_API_KEY") || "",
  searchapi_key: Deno.env.get("SEARCHAPI_KEY") || "",
  deepseek_api_key: Deno.env.get("DEEPSEEK_API_KEY") || "",
  company_name: "ImageInsight",
  support_email: "support@imageinsight.com",
  max_upload_size: "10MB"
};

Deno.serve(async (req) => {
  try {
    const { action, adminId, settings } = await req.json();
    
    if (!action || !adminId) {
      return new Response(
        JSON.stringify({ error: "Missing required parameters" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }
    
    // In a real implementation, we would:
    // 1. Verify that the user is an admin
    // 2. Connect to the database
    // 3. Perform the requested action
    // 4. Return the results
    
    console.log(`Settings action: ${action} by admin ${adminId}`);
    
    let response;
    
    switch (action) {
      case 'getSettings':
        response = getSettings();
        break;
        
      case 'updateSettings':
        if (!settings) {
          return new Response(
            JSON.stringify({ error: "Missing settings parameter" }),
            { status: 400, headers: { "Content-Type": "application/json" } }
          );
        }
        response = updateSettings(settings);
        break;
        
      case 'updateApiKey':
        if (!settings || !settings.key || !settings.value) {
          return new Response(
            JSON.stringify({ error: "Missing key or value parameters" }),
            { status: 400, headers: { "Content-Type": "application/json" } }
          );
        }
        response = updateApiKey(settings.key, settings.value);
        break;
        
      default:
        return new Response(
          JSON.stringify({ error: "Invalid action" }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        );
    }
    
    return new Response(
      JSON.stringify(response),
      { headers: { "Content-Type": "application/json" } }
    );
    
  } catch (error) {
    console.error("Error managing settings:", error);
    return new Response(
      JSON.stringify({ error: "Failed to manage settings: " + error.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
});

// Function to get all settings
function getSettings() {
  // Return the global settings
  return {
    success: true,
    settings: {
      ...globalSettings,
      // Mask API keys for security in the response
      imgbb_api_key: globalSettings.imgbb_api_key ? "••••••••••••••••" : "",
      searchapi_key: globalSettings.searchapi_key ? "••••••••••••••••" : "",
      deepseek_api_key: globalSettings.deepseek_api_key ? "••••••••••••••••" : ""
    },
    // Add a property to indicate which keys are set
    apiKeysSet: {
      imgbb_api_key: !!globalSettings.imgbb_api_key,
      searchapi_key: !!globalSettings.searchapi_key,
      deepseek_api_key: !!globalSettings.deepseek_api_key
    }
  };
}

// Function to update all settings
function updateSettings(settings: any) {
  // Update the global settings
  Object.assign(globalSettings, settings);
  
  // Here we would also update environment variables if possible
  try {
    if (settings.imgbb_api_key) Deno.env.set("IMGBB_API_KEY", settings.imgbb_api_key);
    if (settings.searchapi_key) Deno.env.set("SEARCHAPI_KEY", settings.searchapi_key);
    if (settings.deepseek_api_key) Deno.env.set("DEEPSEEK_API_KEY", settings.deepseek_api_key);
  } catch (error) {
    console.error("Failed to set environment variables:", error);
  }
  
  return {
    success: true,
    message: "Settings updated successfully",
    settings: {
      ...settings,
      // Mask API keys for security in the response
      imgbb_api_key: settings.imgbb_api_key ? "••••••••••••••••" : "",
      searchapi_key: settings.searchapi_key ? "••••••••••••••••" : "",
      deepseek_api_key: settings.deepseek_api_key ? "••••••••••••••••" : ""
    }
  };
}

// Function to update a specific API key
function updateApiKey(key: string, value: string) {
  console.log(`Updating API key ${key} with value:`, value);
  
  // Update the global settings
  globalSettings[key] = value;
  
  // Try to set environment variable
  try {
    if (key === "imgbb_api_key") {
      Deno.env.set("IMGBB_API_KEY", value);
      console.log("Successfully set IMGBB_API_KEY environment variable");
    } else if (key === "searchapi_key") {
      Deno.env.set("SEARCHAPI_KEY", value);
      console.log("Successfully set SEARCHAPI_KEY environment variable");
    } else if (key === "deepseek_api_key") {
      Deno.env.set("DEEPSEEK_API_KEY", value);
      console.log("Successfully set DEEPSEEK_API_KEY environment variable");
    }
  } catch (error) {
    console.error("Failed to set environment variable:", error);
    // Continue anyway, as we'll use the global settings
  }
  
  return {
    success: true,
    message: `API key ${key} updated successfully`,
    key,
    // Don't return the actual value for security reasons
    masked_value: "••••••••••••••••"
  };
}