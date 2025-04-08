import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface AttackVisualizationProps {
  frontRunTxHash: string;
  victimTxHash: string;
  backRunTxHash: string;
  priceImpact: number;
  valueExtracted: number;
  confidence: number;
}

export default function AttackVisualization({
  frontRunTxHash,
  victimTxHash,
  backRunTxHash,
  priceImpact,
  valueExtracted,
  confidence
}: AttackVisualizationProps) {
  return (
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
          <div className="text-red-400 font-medium">+{priceImpact.toFixed(1)}%</div>
        </div>
        <div className="px-3 py-2 bg-app-darker rounded-lg border border-gray-700 flex-1">
          <div className="text-gray-400 mb-1">Value Extracted</div>
          <div className="text-red-400 font-medium">${valueExtracted.toLocaleString()}</div>
        </div>
        <div className="px-3 py-2 bg-app-darker rounded-lg border border-gray-700 flex-1">
          <div className="text-gray-400 mb-1">Confidence</div>
          <div className="text-green-400 font-medium">{confidence}%</div>
        </div>
      </div>
    </div>
  );
}
