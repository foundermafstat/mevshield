import { useQuery, useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import StatsCard from "@/components/stats-card";
import AttackTable from "@/components/attack-table";
import TransactionDetail from "@/components/transaction-detail";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { addToWatchlist, blockAttacker } from "@/lib/blockchain";
import { Attack, Stats } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

export default function Dashboard() {
  const [selectedAttack, setSelectedAttack] = useState<Attack | null>(null);
  const [timeFilter, setTimeFilter] = useState("24h");
  const [exchangeFilter, setExchangeFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const { toast } = useToast();

  // Fetch stats
  const { data: stats, isLoading: statsLoading } = useQuery<Stats>({
    queryKey: ['/api/stats'],
  });

  // Fetch attacks with pagination
  const { data: attacksData, isLoading: attacksLoading } = useQuery<{
    attacks: Attack[];
    pagination: {
      total: number;
      limit: number;
      offset: number;
      hasMore: boolean;
    }
  }>({
    queryKey: ['/api/attacks', { limit: 10, offset: (currentPage - 1) * 10, exchange: exchangeFilter === 'all' ? null : exchangeFilter }],
  });

  // Block attacker mutation
  const blockMutation = useMutation({
    mutationFn: (attack: Attack) => blockAttacker(attack.id),
    onSuccess: () => {
      toast({
        title: "Attacker blocked",
        description: "The attacker has been added to your block list.",
        variant: "default",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/attacks'] });
    },
  });

  // Add to watchlist mutation
  const watchlistMutation = useMutation({
    mutationFn: (attack: Attack) => addToWatchlist(attack.id),
    onSuccess: () => {
      toast({
        title: "Added to watchlist",
        description: "The attacker has been added to your watch list.",
        variant: "default",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/attacks'] });
    },
  });

  const handleViewDetails = (attack: Attack) => {
    setSelectedAttack(attack);
  };

  const handleBlock = (attack: Attack) => {
    blockMutation.mutate(attack);
  };

  const handleAddToWatchlist = (attack: Attack) => {
    watchlistMutation.mutate(attack);
  };

  const handleCloseDetails = () => {
    setSelectedAttack(null);
  };

  const pageCount = attacksData?.pagination?.total 
    ? Math.ceil(attacksData.pagination.total / 10) 
    : 1;

  return (
    <main className="flex-1 relative overflow-y-auto focus:outline-none bg-app-dark">
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <h1 className="text-2xl font-semibold text-white">Dashboard</h1>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          {/* Alert Banner */}
          <Alert className="bg-red-900/40 border border-red-800 rounded-lg mt-6">
            <AlertTitle className="text-sm font-medium text-red-300">
              {stats?.potentialAttacks || 4} potential sandwich attacks detected in the last hour
            </AlertTitle>
            <AlertDescription className="mt-2 text-sm text-red-200">
              Multiple sandwich pattern attacks detected on Uniswap V3. Review the transaction details below.
            </AlertDescription>
          </Alert>

          {/* Stats Grid */}
          <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <StatsCard
              title="Detected Attacks"
              value={statsLoading ? "Loading..." : stats?.totalAttacks?.toString() || "0"}
              changeValue="23%"
              icon="fas fa-exclamation-triangle"
              iconBackground="bg-red-500/20"
              iconColor="text-red-500"
              changeDirection="up"
              changeColor="text-red-400"
            />
            
            <StatsCard
              title="Value at Risk"
              value={statsLoading ? "Loading..." : `$${stats?.valueAtRisk?.toLocaleString()}` || "$0"}
              changeValue="12%"
              icon="fas fa-money-bill-wave"
              iconBackground="bg-yellow-500/20"
              iconColor="text-yellow-500"
              changeDirection="up"
              changeColor="text-yellow-400"
            />
            
            <StatsCard
              title="Protected Transactions"
              value={statsLoading ? "Loading..." : stats?.protectedTransactions?.toLocaleString() || "0"}
              changeValue="7%"
              icon="fas fa-shield-alt"
              iconBackground="bg-green-500/20"
              iconColor="text-green-500"
              changeDirection="up"
              changeColor="text-green-400"
            />
            
            <StatsCard
              title="Monitored DEXs"
              value={statsLoading ? "Loading..." : stats?.monitoredDexs?.toString() || "0"}
              changeValue="2"
              icon="fas fa-exchange-alt"
              iconBackground="bg-blue-500/20"
              iconColor="text-blue-500"
              changeDirection="neutral"
              changeColor="text-blue-400"
            />
          </div>

          {/* Recent Attacks Panel */}
          <div className="mt-8">
            <div className="pb-5 border-b border-gray-700 flex items-center justify-between">
              <h3 className="text-lg leading-6 font-medium text-white">Recent Attack Detections</h3>
              <div className="flex items-center">
                <div className="relative inline-block text-left mr-3">
                  <Select value={exchangeFilter} onValueChange={setExchangeFilter}>
                    <SelectTrigger className="block w-full pl-3 pr-10 py-2 text-base border-gray-600 bg-app-darker text-white rounded-md focus:outline-none focus:ring-app-accent focus:border-app-accent sm:text-sm">
                      <SelectValue placeholder="All Exchanges" />
                    </SelectTrigger>
                    <SelectContent className="bg-app-darker text-white border-gray-700">
                      <SelectItem value="all">All Exchanges</SelectItem>
                      <SelectItem value="Uniswap V3">Uniswap V3</SelectItem>
                      <SelectItem value="SushiSwap">SushiSwap</SelectItem>
                      <SelectItem value="PancakeSwap">PancakeSwap</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Select value={timeFilter} onValueChange={setTimeFilter}>
                    <SelectTrigger className="block w-full pl-3 pr-10 py-2 text-base border-gray-600 bg-app-darker text-white rounded-md focus:outline-none focus:ring-app-accent focus:border-app-accent sm:text-sm">
                      <SelectValue placeholder="Last 24 Hours" />
                    </SelectTrigger>
                    <SelectContent className="bg-app-darker text-white border-gray-700">
                      <SelectItem value="24h">Last 24 Hours</SelectItem>
                      <SelectItem value="7d">Last 7 Days</SelectItem>
                      <SelectItem value="30d">Last 30 Days</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            
            {/* Attack Table */}
            {attacksLoading ? (
              <div className="py-10 text-center text-gray-400">Loading attacks...</div>
            ) : attacksData?.attacks && attacksData.attacks.length > 0 ? (
              <AttackTable 
                attacks={attacksData.attacks} 
                onViewDetails={handleViewDetails}
                onBlock={handleBlock}
              />
            ) : (
              <div className="py-10 text-center text-gray-400">No attacks found</div>
            )}
            
            {/* Pagination */}
            {attacksData?.pagination && attacksData.pagination.total > 0 && (
              <div className="pt-5 flex justify-between items-center">
                <span className="text-sm text-gray-400">
                  Showing <span className="font-medium">{attacksData.pagination.offset + 1}</span> to{" "}
                  <span className="font-medium">
                    {Math.min(attacksData.pagination.offset + attacksData.attacks.length, attacksData.pagination.total)}
                  </span>{" "}
                  of <span className="font-medium">{attacksData.pagination.total}</span> results
                </span>
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious 
                        href="#" 
                        onClick={(e) => {
                          e.preventDefault();
                          if (currentPage > 1) setCurrentPage(currentPage - 1);
                        }}
                        className={`${currentPage === 1 ? 'pointer-events-none opacity-50' : ''} bg-app-darker text-gray-400 hover:bg-app-light hover:text-white border border-gray-700`}
                      />
                    </PaginationItem>
                    
                    {Array.from({ length: Math.min(5, pageCount) }).map((_, i) => {
                      const pageNumber = i + 1;
                      return (
                        <PaginationItem key={i}>
                          <PaginationLink 
                            href="#" 
                            onClick={(e) => {
                              e.preventDefault();
                              setCurrentPage(pageNumber);
                            }}
                            isActive={pageNumber === currentPage}
                            className={`${pageNumber === currentPage ? 'bg-app-light text-white' : 'bg-app-darker text-gray-400 hover:bg-app-light hover:text-white'} border border-gray-700`}
                          >
                            {pageNumber}
                          </PaginationLink>
                        </PaginationItem>
                      );
                    })}
                    
                    {pageCount > 5 && (
                      <>
                        <PaginationItem>
                          <span className="relative inline-flex items-center px-4 py-2 border border-gray-700 bg-app-darker text-sm font-medium text-gray-400">
                            ...
                          </span>
                        </PaginationItem>
                        <PaginationItem>
                          <PaginationLink 
                            href="#" 
                            onClick={(e) => {
                              e.preventDefault();
                              setCurrentPage(pageCount);
                            }}
                            className="bg-app-darker text-gray-400 hover:bg-app-light hover:text-white border border-gray-700"
                          >
                            {pageCount}
                          </PaginationLink>
                        </PaginationItem>
                      </>
                    )}
                    
                    <PaginationItem>
                      <PaginationNext 
                        href="#" 
                        onClick={(e) => {
                          e.preventDefault();
                          if (currentPage < pageCount) setCurrentPage(currentPage + 1);
                        }}
                        className={`${currentPage === pageCount ? 'pointer-events-none opacity-50' : ''} bg-app-darker text-gray-400 hover:bg-app-light hover:text-white border border-gray-700`}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
            
            {/* Transaction Details Panel */}
            {selectedAttack && (
              <TransactionDetail 
                attack={selectedAttack}
                onClose={handleCloseDetails}
                onBlock={handleBlock}
                onAddToWatchlist={handleAddToWatchlist}
              />
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
