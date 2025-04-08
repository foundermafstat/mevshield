import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/dashboard";
import Alerts from "@/pages/alerts";
import Transactions from "@/pages/transactions";
import Settings from "@/pages/settings";
import Sidebar from "@/components/sidebar";
import NavBar from "@/components/navbar";

function Router() {
  return (
    <div className="flex h-screen overflow-hidden bg-app-dark text-gray-100">
      <Sidebar />
      <div className="flex flex-col flex-1 w-0 overflow-hidden">
        <NavBar />
        <Switch>
          <Route path="/" component={Dashboard} />
          <Route path="/alerts" component={Alerts} />
          <Route path="/transactions" component={Transactions} />
          <Route path="/settings" component={Settings} />
          <Route component={NotFound} />
        </Switch>
      </div>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
