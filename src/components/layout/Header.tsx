import { useState } from "react";
import { Link } from "react-router";
import { 
  User, 
  Menu, 
  X, 
  Home, 
  Info, 
  FileText, Mail, 
  Package, 
  LogOut,
  LayoutDashboard,
  Camera,
  Search
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useUserStore } from "@/lib/stores/userStore";
import { cn } from "@/lib/utils";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useUserStore();
  
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:bg-gray-900/95 dark:border-gray-800">
      <div className="container max-w-7xl mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center space-x-2">
            <Camera className="h-6 w-6 text-purple-600" />
            <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 text-transparent bg-clip-text">ImageInsight</span>
          </Link>
        </div>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link to="/" className="text-sm font-medium transition-colors hover:text-purple-600">
            Home
          </Link>
          <Link to="/services" className="text-sm font-medium transition-colors hover:text-purple-600">
            Services
          </Link>
          <Link to="/pricing" className="text-sm font-medium transition-colors hover:text-purple-600">
            Pricing
          </Link>
          <Link to="/blog" className="text-sm font-medium transition-colors hover:text-purple-600">
            Blog
          </Link>
          <Link to="/about" className="text-sm font-medium transition-colors hover:text-purple-600">
            About
          </Link>
          <Link to="/contact" className="text-sm font-medium transition-colors hover:text-purple-600">
            Contact
          </Link>
          <Link to="/dashboard" className="text-sm font-medium transition-colors hover:text-purple-600">
            Dashboard
          </Link>
        </nav>
        
        <div className="flex items-center gap-4">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full bg-purple-100 text-purple-700">
                  <span className="font-semibold">{user.email.charAt(0).toUpperCase()}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user.email}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user.subscription || "Free Tier"}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/dashboard" className="cursor-pointer flex w-full items-center">
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    <span>Dashboard</span>
                  </Link>
                </DropdownMenuItem>
                {user.role === 'admin' && (
                  <DropdownMenuItem asChild>
                    <Link to="/admin" className="cursor-pointer flex w-full items-center">
                      <Package className="mr-2 h-4 w-4" />
                      <span>Admin Panel</span>
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={logout}
                  className="cursor-pointer text-red-600"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="ghost" asChild className="text-gray-700 hover:text-purple-600 hover:bg-purple-50">
                <Link to="/login">Log in</Link>
              </Button>
              <Button asChild className="bg-purple-600 hover:bg-purple-700">
                <Link to="/signup">Sign up</Link>
              </Button>
            </div>
          )}
          
          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            className="md:hidden"
            size="icon"
            onClick={toggleMenu}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>
      
      {/* Mobile Navigation */}
      <div className={cn(
        "md:hidden fixed inset-0 top-16 z-50 grid h-[calc(100vh-4rem)] grid-flow-row auto-rows-max overflow-auto p-6 pb-32 shadow-md animate-in slide-in-from-bottom-80 bg-white dark:bg-gray-900",
        isMenuOpen ? "block" : "hidden"
      )}>
        <div className="relative z-20 grid gap-6 rounded-md p-4">
          <Link to="/" className="flex items-center space-x-2" onClick={toggleMenu}>
            <Home className="h-5 w-5 text-purple-600" />
            <span>Home</span>
          </Link>
          <Link to="/services" className="flex items-center space-x-2" onClick={toggleMenu}>
            <Package className="h-5 w-5 text-purple-600" />
            <span>Services</span>
          </Link>
          <Link to="/pricing" className="flex items-center space-x-2" onClick={toggleMenu}>
            <FileText className="h-5 w-5 text-purple-600" />
            <span>Pricing</span>
          </Link>
          <Link to="/blog" className="flex items-center space-x-2" onClick={toggleMenu}>
            <FileText className="h-5 w-5 text-purple-600" />
            <span>Blog</span>
          </Link>
          <Link to="/about" className="flex items-center space-x-2" onClick={toggleMenu}>
            <Info className="h-5 w-5 text-purple-600" />
            <span>About</span>
          </Link>
          <Link to="/contact" className="flex items-center space-x-2" onClick={toggleMenu}>
            <Mail className="h-5 w-5 text-purple-600" />
            <span>Contact</span>
          </Link>
          {user && (
            <Link to="/dashboard" className="flex items-center space-x-2" onClick={toggleMenu}>
              <LayoutDashboard className="h-5 w-5 text-purple-600" />
              <span>Dashboard</span>
            </Link>
          )}
          {user && user.role === 'admin' && (
            <Link to="/admin" className="flex items-center space-x-2" onClick={toggleMenu}>
              <Package className="h-5 w-5 text-purple-600" />
              <span>Admin Panel</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}