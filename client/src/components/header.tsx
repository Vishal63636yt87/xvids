import { useState } from "react";
import { Link } from "wouter";
import { Search, Bell, User, Play } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

interface HeaderProps {
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
}

export default function Header({ searchQuery = "", onSearchChange }: HeaderProps) {
  const [localSearch, setLocalSearch] = useState(searchQuery);
  const { isAuthenticated } = useAuth();

  const handleSearch = (value: string) => {
    setLocalSearch(value);
    onSearchChange?.(value);
  };

  return (
    <header className="bg-[var(--stream-surface)] border-b border-gray-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 text-2xl font-bold text-[var(--stream-red)] hover:text-red-400 transition-colors">
            <Play className="w-8 h-8" />
            <span>VideoHub</span>
          </Link>

          {/* Search Bar */}
          <div className="flex-1 max-w-2xl mx-8">
            <div className="relative">
              <Input
                type="text"
                placeholder="Search videos..."
                value={localSearch}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full bg-gray-800 border-gray-600 rounded-full py-2 px-4 pl-10 text-white placeholder:text-gray-400 focus:border-[var(--stream-red)] focus:ring-1 focus:ring-[var(--stream-red)]"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            </div>
          </div>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            {/* Only show admin button for authenticated admin */}
            {isAuthenticated && (
              <Link href="/admin">
                <Button variant="outline" className="bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600">
                  Admin Dashboard
                </Button>
              </Link>
            )}
            
            {/* Login button for non-authenticated users */}
            {!isAuthenticated && (
              <Link href="/admin/login">
                <Button className="bg-[var(--stream-red)] hover:bg-red-600 text-white font-medium">
                  Admin Login
                </Button>
              </Link>
            )}
            
            <Button 
              variant="ghost" 
              size="icon"
              className="bg-gray-700 hover:bg-gray-600 text-gray-300"
            >
              <Bell className="w-4 h-4" />
            </Button>
            <div className="w-8 h-8 bg-[var(--stream-green)] rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-black" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
