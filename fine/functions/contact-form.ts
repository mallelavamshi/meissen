// Function to handle contact form submissions

Deno.serve(async (req) => {
  try {
    const { name, email, subject, message } = await req.json();
    
    if (!name || !email || !message) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return new Response(
        JSON.stringify({ error: "Invalid email format" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }
    
    // In a real implementation, we would:
    // 1. Save the contact submission to the database
    // 2. Send a notification email to the admin
    // 3. Send a confirmation email to the user
    
    console.log("Contact form submission:", { name, email, subject, message });
    
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return new Response(
      JSON.stringify({
        success: true,
        message: "Your message has been received. We'll get back to you soon.",
        submissionId: crypto.randomUUID()
      }),
      { headers: { "Content-Type": "application/json" } }
    );
    
  } catch (error) {
    console.error("Error processing contact form:", error);
    return new Response(
      JSON.stringify({ error: "Failed to process contact form: " + error.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
});