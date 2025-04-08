import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Attack } from "@shared/schema";
import { formatHash } from "@/lib/blockchain";
import { Badge } from "@/components/ui/badge";

interface TransactionDetailProps {
  attack: Attack;
  onClose: () => void;
  onBlock: (attack: Attack) => void;
  onAddToWatchlist: (attack: Attack) => void;
}

export default function TransactionDetail({ 
  attack, 
  onClose, 
  onBlock, 
  onAddToWatchlist 
}: TransactionDetailProps) {
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
    <Card className="mt-8 bg-app-darker shadow overflow-hidden sm:rounded-lg border border-gray-700">
      <CardHeader className="px-4 py-5 sm:px-6 flex justify-between items-center">
        <div>
          <CardTitle className="text-lg leading-6 font-medium text-white">Transaction Detail</CardTitle>
          <CardDescription className="mt-1 max-w-2xl text-sm text-gray-400">
            {attack.status} on {attack.tokenPair} pair
          </CardDescription>
        </div>
        <Button 
          variant="ghost" 
          size="icon"
          className="p-1 rounded-full text-gray-400 hover:text-white"
          onClick={onClose}
        >
          <i className="fas fa-times"></i>
        </Button>
      </CardHeader>
      
      <CardContent className="border-t border-gray-700 px-4 py-5 sm:p-6">
        {/* Sandwich Visualization */}
        <div className="mb-6 p-4 bg-app-dark rounded-lg border border-gray-700">
          <h4 className="text-sm font-medium text-gray-300 mb-4">Attack Visualization</h4>
          <div className="flex flex-col items-center space-y-4">
            <div className="w-full flex items-center">
              <div className="w-64 text-right pr-4">
                <span className="text-sm font-mono p-1 bg-red-900/40 rounded text-red-300">Front-run</span>
              </div>
              <div className="flex-1 relative h-10">
                <div className="absolute inset-0 border-t-2 border-gray-700"></div>
                <div className="absolute top-1/2 right-0 transform -translate-y-1/2 w-3 h-3 bg-red-500 rounded-full"></div>
                <div className="absolute top-1/2 transform -translate-y-1/2 -translate-x-1/2 text-xs text-gray-400">Tx #1</div>
              </div>
            </div>
            
            <div className="w-full flex items-center">
              <div className="w-64 text-right pr-4">
                <span className="text-sm font-mono p-1 bg-yellow-900/40 rounded text-yellow-300">Victim</span>
              </div>
              <div className="flex-1 relative h-10">
                <div className="absolute inset-0 border-t-2 border-gray-700"></div>
                <div className="absolute top-1/2 right-1/2 transform -translate-y-1/2 w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div className="absolute top-1/2 transform -translate-y-1/2 -translate-x-1/2 ml-16 text-xs text-gray-400">Tx #2</div>
              </div>
            </div>
            
            <div className="w-full flex items-center">
              <div className="w-64 text-right pr-4">
                <span className="text-sm font-mono p-1 bg-red-900/40 rounded text-red-300">Back-run</span>
              </div>
              <div className="flex-1 relative h-10">
                <div className="absolute inset-0 border-t-2 border-gray-700"></div>
                <div className="absolute top-1/2 right-full transform -translate-y-1/2 translate-x-8 w-3 h-3 bg-red-500 rounded-full"></div>
                <div className="absolute top-1/2 transform -translate-y-1/2 -translate-x-1/2 ml-32 text-xs text-gray-400">Tx #3</div>
              </div>
            </div>
          </div>
          
          <div className="mt-6 flex space-x-4 text-sm">
            <div className="px-3 py-2 bg-app-darker rounded-lg border border-gray-700 flex-1">
              <div className="text-gray-400 mb-1">Price Impact</div>
              <div className="text-red-400 font-medium">+{attack.priceImpact.toFixed(1)}%</div>
            </div>
            <div className="px-3 py-2 bg-app-darker rounded-lg border border-gray-700 flex-1">
              <div className="text-gray-400 mb-1">Value Extracted</div>
              <div className="text-red-400 font-medium">${attack.valueExtracted.toLocaleString()}</div>
            </div>
            <div className="px-3 py-2 bg-app-darker rounded-lg border border-gray-700 flex-1">
              <div className="text-gray-400 mb-1">Confidence</div>
              <div className="text-green-400 font-medium">{attack.confidence}%</div>
            </div>
          </div>
        </div>
        
        {/* Transaction Table */}
        <div className="overflow-hidden border border-gray-700 rounded-lg">
          <Table>
            <TableHeader className="bg-app-light">
              <TableRow>
                <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Step</TableHead>
                <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Transaction Hash</TableHead>
                <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">From</TableHead>
                <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Gas Price</TableHead>
                <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="bg-app-darker divide-y divide-gray-700">
              <TableRow className="bg-red-900/20">
                <TableCell className="px-6 py-4 whitespace-nowrap">
                  <Badge className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-200 text-red-800">
                    Front-run
                  </Badge>
                </TableCell>
                <TableCell className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-300">
                  {attack.frontRunTxHash}
                </TableCell>
                <TableCell className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-300">
                  {attack.attackerAddress}
                </TableCell>
                <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  {attack.metadata?.gasPrice?.frontRun || '42'} Gwei
                </TableCell>
                <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  Buy {(Math.random() * 20 + 5).toFixed(1)} {attack.token0Symbol}
                </TableCell>
              </TableRow>
              
              <TableRow className="bg-yellow-900/10">
                <TableCell className="px-6 py-4 whitespace-nowrap">
                  <Badge className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-200 text-yellow-800">
                    Victim
                  </Badge>
                </TableCell>
                <TableCell className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-300">
                  {attack.victimTxHash}
                </TableCell>
                <TableCell className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-300">
                  {attack.victimAddress}
                </TableCell>
                <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  {attack.metadata?.gasPrice?.victim || '35'} Gwei
                </TableCell>
                <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  Buy {(Math.random() * 10 + 1).toFixed(1)} {attack.token0Symbol}
                </TableCell>
              </TableRow>
              
              <TableRow className="bg-red-900/20">
                <TableCell className="px-6 py-4 whitespace-nowrap">
                  <Badge className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-200 text-red-800">
                    Back-run
                  </Badge>
                </TableCell>
                <TableCell className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-300">
                  {attack.backRunTxHash}
                </TableCell>
                <TableCell className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-300">
                  {attack.attackerAddress}
                </TableCell>
                <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  {attack.metadata?.gasPrice?.backRun || '40'} Gwei
                </TableCell>
                <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  Sell {(Math.random() * 20 + 5).toFixed(1)} {attack.token0Symbol}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
        
        <div className="mt-6 flex flex-col sm:flex-row sm:justify-between">
          <Button 
            variant="destructive" 
            className="w-full sm:w-auto px-4 py-2 mb-3 sm:mb-0"
            onClick={() => onBlock(attack)}
          >
            Block This Attacker
          </Button>
          <div className="space-x-3">
            <Button 
              variant="outline" 
              className="px-4 py-2 border border-gray-700 text-white bg-app-dark hover:bg-app-light"
              onClick={() => onAddToWatchlist(attack)}
            >
              Add to Watchlist
            </Button>
            <Button 
              className="px-4 py-2 text-white bg-app-accent hover:bg-blue-600"
            >
              Export Details
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
