import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";

const navItems = [
  { name: "Dashboard", path: "/", icon: "fas fa-chart-line" },
  { name: "Alerts", path: "/alerts", icon: "fas fa-exclamation-triangle" },
  { name: "Transaction History", path: "/transactions", icon: "fas fa-history" },
  { name: "Settings", path: "/settings", icon: "fas fa-cog" }
];

export default function Sidebar() {
  const [location] = useLocation();

  return (
    <div className="hidden md:flex md:flex-shrink-0">
      <div className="flex flex-col w-64 bg-app-darker">
        <div className="flex items-center h-16 px-4 border-b border-gray-700">
          <div className="flex items-center">
            <i className="fas fa-shield-alt text-app-accent text-2xl mr-2"></i>
            <span className="text-xl font-semibold">DeFi Shield</span>
          </div>
        </div>
        <div className="h-0 flex-1 flex flex-col overflow-y-auto">
          <nav className="flex-1 px-2 py-4 space-y-1">
            {navItems.map(item => (
              <Link key={item.path} href={item.path}>
                <a className={cn(
                  "flex items-center px-2 py-2 text-base rounded-md group",
                  location === item.path
                    ? "bg-app-light text-white"
                    : "text-gray-300 hover:bg-app-light hover:text-white"
                )}>
                  <i className={cn(
                    item.icon,
                    "mr-4",
                    location === item.path
                      ? "text-app-accent"
                      : "text-gray-400 group-hover:text-app-accent"
                  )}></i>
                  {item.name}
                </a>
              </Link>
            ))}
          </nav>
          <div className="p-4 border-t border-gray-700">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <i className="fas fa-network-wired text-gray-400"></i>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-white">Network</p>
                <div className="flex items-center text-sm text-gray-400">
                  <span className="h-2 w-2 rounded-full bg-green-400 mr-1"></span>
                  Ethereum Mainnet
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
