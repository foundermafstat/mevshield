import { useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Link } from "wouter";
import Sidebar from "./sidebar";

export default function NavBar() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-gray-900 bg-opacity-75 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      {/* Mobile sidebar */}
      <div className={cn(
        "fixed inset-y-0 left-0 flex flex-col z-50 w-64 bg-app-darker transform transition-transform duration-300 ease-in-out md:hidden",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="absolute top-0 right-0 -mr-12 pt-2">
          <button
            type="button"
            className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
            onClick={() => setSidebarOpen(false)}
          >
            <span className="sr-only">Close sidebar</span>
            <i className="fas fa-times text-white"></i>
          </button>
        </div>
        <Sidebar />
      </div>
      
      {/* Top navbar */}
      <div className="relative z-10 flex-shrink-0 flex h-16 bg-app-darker border-b border-gray-700">
        <button 
          type="button" 
          className="md:hidden px-4 text-gray-300 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-app-accent"
          onClick={() => setSidebarOpen(true)}
        >
          <i className="fas fa-bars"></i>
        </button>
        <div className="flex-1 px-4 flex justify-between">
          <div className="flex-1 flex items-center">
            <div className="max-w-lg w-full lg:max-w-xs">
              <label htmlFor="search" className="sr-only">Search</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <i className="fas fa-search text-gray-400"></i>
                </div>
                <Input
                  id="search"
                  className="pl-10 pr-3 py-2 text-gray-300 bg-app-dark border border-gray-600 focus:outline-none focus:border-app-accent"
                  placeholder="Search transactions or addresses"
                />
              </div>
            </div>
          </div>
          <div className="ml-4 flex items-center md:ml-6">
            <Button variant="ghost" size="icon" className="p-1 rounded-full text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-app-darker focus:ring-app-accent">
              <i className="fas fa-bell"></i>
            </Button>
            <div className="ml-3 relative">
              <div>
                <Button variant="ghost" size="icon" className="max-w-xs bg-app-darker flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-app-darker focus:ring-app-accent">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-gray-700 text-white">VS</AvatarFallback>
                  </Avatar>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
