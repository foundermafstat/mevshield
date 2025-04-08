import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Attack } from "@shared/schema";
import { formatTimeElapsed } from "@/lib/blockchain";

export default function Transactions() {
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  
  // Fetch attacks
  const { data: attacksData, isLoading } = useQuery<{
    attacks: Attack[];
    pagination: { total: number; limit: number; offset: number; hasMore: boolean };
  }>({
    queryKey: ['/api/attacks', { limit: 20, offset: 0, status: selectedStatus !== 'all' ? selectedStatus : undefined }],
  });
  
  // Filter attacks by search query
  const filteredAttacks = attacksData?.attacks.filter(attack => {
    if (!searchQuery) return true;
    
    const searchLower = searchQuery.toLowerCase();
    return (
      attack.tokenPair.toLowerCase().includes(searchLower) ||
      attack.exchange.toLowerCase().includes(searchLower) ||
      attack.frontRunTxHash.toLowerCase().includes(searchLower) ||
      attack.victimTxHash.toLowerCase().includes(searchLower) ||
      attack.backRunTxHash.toLowerCase().includes(searchLower) ||
      attack.attackerAddress.toLowerCase().includes(searchLower) ||
      attack.victimAddress.toLowerCase().includes(searchLower)
    );
  });
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Confirmed Attack':
        return "bg-red-200 text-red-800";
      case 'Potential Attack':
        return "bg-yellow-200 text-yellow-800";
      case 'False Positive':
        return "bg-green-200 text-green-800";
      default:
        return "bg-gray-200 text-gray-800";
    }
  };

  return (
    <main className="flex-1 relative overflow-y-auto focus:outline-none bg-app-dark">
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <h1 className="text-2xl font-semibold text-white">Transaction History</h1>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <Card className="mt-6 bg-app-darker shadow overflow-hidden border border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Transaction Analysis</CardTitle>
              <CardDescription>View and search through all analyzed transactions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="w-full md:w-2/3">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <i className="fas fa-search text-gray-400"></i>
                    </div>
                    <Input 
                      type="text"
                      placeholder="Search by token pair, transaction hash, or address"
                      className="pl-10 py-2 bg-app-dark border-gray-700 text-white"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>
                <div className="w-full md:w-1/3">
                  <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                    <SelectTrigger className="w-full bg-app-dark border-gray-700 text-white">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent className="bg-app-darker border-gray-700 text-white">
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="Confirmed Attack">Confirmed Attacks</SelectItem>
                      <SelectItem value="Potential Attack">Potential Attacks</SelectItem>
                      <SelectItem value="False Positive">False Positives</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              {isLoading ? (
                <div className="text-center py-10 text-gray-400">Loading transactions...</div>
              ) : filteredAttacks && filteredAttacks.length > 0 ? (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader className="bg-app-light">
                      <TableRow>
                        <TableHead className="text-gray-300">Status</TableHead>
                        <TableHead className="text-gray-300">Token Pair</TableHead>
                        <TableHead className="text-gray-300">Exchange</TableHead>
                        <TableHead className="text-gray-300">Victim TX</TableHead>
                        <TableHead className="text-gray-300">Value Extracted</TableHead>
                        <TableHead className="text-gray-300">Time</TableHead>
                        <TableHead className="text-gray-300">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredAttacks.map((attack) => (
                        <TableRow key={attack.id} className="hover:bg-app-light/10">
                          <TableCell>
                            <Badge className={`${getStatusColor(attack.status)}`}>
                              {attack.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-white">
                            <div className="flex items-center">
                              <span className="flex-shrink-0 h-6 w-6 rounded-full bg-gray-700 flex items-center justify-center mr-1 text-xs">{attack.token0Symbol}</span>
                              <span className="flex-shrink-0 h-6 w-6 rounded-full bg-gray-700 flex items-center justify-center mr-1 text-xs">{attack.token1Symbol}</span>
                              {attack.tokenPair}
                            </div>
                          </TableCell>
                          <TableCell className="text-gray-300">{attack.exchange}</TableCell>
                          <TableCell className="text-gray-300 font-mono text-xs">{attack.victimTxHash}</TableCell>
                          <TableCell className={`${attack.valueExtracted > 0 ? 'text-red-400' : 'text-gray-300'}`}>
                            ${attack.valueExtracted.toLocaleString()}
                          </TableCell>
                          <TableCell className="text-gray-300">
                            {formatTimeElapsed(attack.timestamp)}
                          </TableCell>
                          <TableCell>
                            <Button variant="link" className="text-app-accent hover:text-blue-400 p-0">
                              View
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-10 text-gray-400">
                  No transactions found matching your criteria
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
