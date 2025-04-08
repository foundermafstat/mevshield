import { TableCell, TableRow, TableHead, TableHeader, TableBody, Table } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Attack } from "@shared/schema";
import { formatTimeElapsed, formatHash } from "@/lib/blockchain";
import { useState } from "react";

interface AttackTableProps {
  attacks: Attack[];
  onViewDetails: (attack: Attack) => void;
  onBlock: (attack: Attack) => void;
}

export default function AttackTable({ attacks, onViewDetails, onBlock }: AttackTableProps) {
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

  const getRowColor = (status: string) => {
    switch (status) {
      case 'Confirmed Attack':
        return "bg-red-900/20 hover:bg-red-900/30";
      case 'Potential Attack':
        return "bg-yellow-900/10 hover:bg-yellow-900/20";
      case 'False Positive':
        return "hover:bg-app-light/10";
      default:
        return "hover:bg-app-light/10";
    }
  };

  return (
    <div className="mt-6 flex flex-col">
      <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
          <div className="shadow overflow-hidden border border-gray-700 sm:rounded-lg">
            <Table>
              <TableHeader className="bg-app-light">
                <TableRow>
                  <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Status</TableHead>
                  <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Exchange</TableHead>
                  <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Token Pair</TableHead>
                  <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Value Extracted</TableHead>
                  <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Time</TableHead>
                  <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="bg-app-darker divide-y divide-gray-700">
                {attacks.map(attack => (
                  <TableRow 
                    key={attack.id}
                    className={`cursor-pointer ${getRowColor(attack.status)}`}
                    onClick={() => onViewDetails(attack)}
                  >
                    <TableCell className="px-6 py-4 whitespace-nowrap">
                      <Badge variant="outline" className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(attack.status)}`}>
                        {attack.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {attack.exchange}
                    </TableCell>
                    <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      <div className="flex items-center">
                        <span className="flex-shrink-0 h-6 w-6 rounded-full bg-gray-700 flex items-center justify-center mr-1 text-xs">{attack.token0Symbol}</span>
                        <span className="flex-shrink-0 h-6 w-6 rounded-full bg-gray-700 flex items-center justify-center mr-1 text-xs">{attack.token1Symbol}</span>
                        {attack.tokenPair}
                      </div>
                    </TableCell>
                    <TableCell className={`px-6 py-4 whitespace-nowrap text-sm ${attack.status === 'Confirmed Attack' ? 'text-red-400' : attack.status === 'Potential Attack' ? 'text-yellow-400' : 'text-gray-300'}`}>
                      ${attack.valueExtracted.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </TableCell>
                    <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      <div className="flex items-center">
                        <i className="fas fa-clock mr-1 text-gray-500"></i>
                        {formatTimeElapsed(attack.timestamp)}
                      </div>
                    </TableCell>
                    <TableCell className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Button 
                        variant="ghost" 
                        className="text-app-accent hover:text-blue-400 mr-3"
                        onClick={(e) => {
                          e.stopPropagation();
                          onViewDetails(attack);
                        }}
                      >
                        View Details
                      </Button>
                      <Button 
                        variant="ghost" 
                        className="text-gray-400 hover:text-gray-300"
                        onClick={(e) => {
                          e.stopPropagation();
                          onBlock(attack);
                        }}
                      >
                        Block
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
}
