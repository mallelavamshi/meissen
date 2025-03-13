import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router";

export default function BlogPage() {
  // Mock blog posts
  const blogPosts = [
    {
      id: "1",
      title: "How AI is Transforming Estate Sales",
      excerpt: "Discover how artificial intelligence is revolutionizing the way estate sale companies identify and price items.",
      date: "May 15, 2023",
      author: "Jane Smith",
      category: "Technology",
      image: "https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
    },
    {
      id: "2",
      title: "Top 10 Items to Look for at Estate Sales",
      excerpt: "Learn about the most valuable and commonly overlooked items that you should keep an eye out for at estate sales.",
      date: "April 28, 2023",
      author: "Michael Johnson",
      category: "Tips & Tricks",
      image: "https://images.unsplash.com/photo-1551380701-5dd33d5b5ce6?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
    },
    {
      id: "3",
      title: "The Future of Auction Technology",
      excerpt: "Explore the emerging technologies that are set to transform the auction industry in the coming years.",
      date: "April 10, 2023",
      author: "Sarah Williams",
      category: "Industry Trends",
      image: "https://images.unsplash.com/photo-1607082349566-187342175e2f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
    },
    {
      id: "4",
      title: "Pricing Strategies for Estate Sale Companies",
      excerpt: "Effective pricing strategies that can help estate sale companies maximize profits while ensuring quick sales.",
      date: "March 22, 2023",
      author: "David Brown",
      category: "Business",
      image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
    },
    {
      id: "5",
      title: "How to Photograph Items for Better AI Analysis",
      excerpt: "Tips and techniques for capturing high-quality photos that will yield the most accurate AI analysis results.",
      date: "March 5, 2023",
      author: "Emily Chen",
      category: "Photography",
      image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
    },
    {
      id: "6",
      title: "Understanding Antique Furniture Styles",
      excerpt: "A comprehensive guide to identifying different antique furniture styles and periods.",
      date: "February 18, 2023",
      author: "Robert Miller",
      category: "Education",
      image: "https://images.unsplash.com/photo-1567016432779-094069958ea5?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
    }
  ];
  
  // Categories for filtering
  const categories = [
    "All",
    "Technology",
    "Tips & Tricks",
    "Industry Trends",
    "Business",
    "Photography",
    "Education"
  ];
  
  return (
    <MainLayout>
      <div className="container py-12 md:py-16">
        <div className="text-center space-y-4 mb-12">
          <h1 className="text-3xl md:text-4xl font-bold">Blog</h1>
          <p className="text-muted-foreground md:text-lg max-w-2xl mx-auto">
            Insights, tips, and news for estate sale and auction professionals.
          </p>
        </div>
        
        <div className="flex flex-wrap gap-2 mb-8 justify-center">
          {categories.map((category) => (
            <Button
              key={category}
              variant={category === "All" ? "default" : "outline"}
              size="sm"
            >
              {category}
            </Button>
          ))}
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogPosts.map((post) => (
            <Card key={post.id} className="overflow-hidden flex flex-col h-full">
              <div className="aspect-video relative overflow-hidden">
                <div className="bg-muted h-full w-full flex items-center justify-center">
                  <span className="text-muted-foreground">Image Placeholder</span>
                </div>
                <div className="absolute top-2 right-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded">
                  {post.category}
                </div>
              </div>
              <CardHeader className="pb-2">
                <CardTitle className="text-xl">{post.title}</CardTitle>
                <CardDescription className="flex items-center text-xs">
                  <span>{post.date}</span>
                  <span className="mx-2">•</span>
                  <span>{post.author}</span>
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <p className="text-muted-foreground text-sm">
                  {post.excerpt}
                </p>
              </CardContent>
              <CardFooter>
                <Button variant="outline" asChild className="w-full">
                  <Link to={`/blog/${post.id}`}>Read More</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
        
        <div className="flex justify-center mt-8">
          <Button variant="outline">Load More</Button>
        </div>
        
        <div className="mt-16 bg-muted p-8 rounded-lg text-center">
          <h2 className="text-2xl font-bold mb-4">Subscribe to Our Newsletter</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-6">
            Stay up to date with the latest industry news, tips, and insights delivered straight to your inbox.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Your email address"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
            <Button>Subscribe</Button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}