import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Attack } from "@shared/schema";

export default function Alerts() {
  // Fetch recent attacks
  const { data: attacksData, isLoading } = useQuery<{
    attacks: Attack[];
    pagination: { total: number; limit: number; offset: number; hasMore: boolean };
  }>({
    queryKey: ['/api/attacks', { limit: 5, offset: 0 }],
  });

  return (
    <main className="flex-1 relative overflow-y-auto focus:outline-none bg-app-dark">
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <h1 className="text-2xl font-semibold text-white">Alerts</h1>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          {/* Alert Configuration */}
          <Card className="mt-6 bg-app-darker shadow overflow-hidden border border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Alert Configuration</CardTitle>
              <CardDescription>Manage how you receive alerts about detected attacks</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 border border-gray-700 rounded-md">
                  <div>
                    <h3 className="text-white font-medium">Email Notifications</h3>
                    <p className="text-gray-400 text-sm">Receive email alerts for confirmed attacks</p>
                  </div>
                  <Button variant="outline" className="bg-app-accent hover:bg-blue-600 text-white">
                    Enabled
                  </Button>
                </div>
                
                <div className="flex justify-between items-center p-3 border border-gray-700 rounded-md">
                  <div>
                    <h3 className="text-white font-medium">Dashboard Alerts</h3>
                    <p className="text-gray-400 text-sm">Show real-time alerts in the dashboard</p>
                  </div>
                  <Button variant="outline" className="bg-app-accent hover:bg-blue-600 text-white">
                    Enabled
                  </Button>
                </div>
                
                <div className="flex justify-between items-center p-3 border border-gray-700 rounded-md">
                  <div>
                    <h3 className="text-white font-medium">Webhook Notifications</h3>
                    <p className="text-gray-400 text-sm">Send alerts to a custom webhook URL</p>
                  </div>
                  <Button variant="outline" className="bg-app-dark hover:bg-app-light text-white">
                    Disabled
                  </Button>
                </div>
                
                <div className="flex justify-between items-center p-3 border border-gray-700 rounded-md">
                  <div>
                    <h3 className="text-white font-medium">Minimum Alert Threshold</h3>
                    <p className="text-gray-400 text-sm">Only alert on attacks above a certain value</p>
                  </div>
                  <div className="flex items-center">
                    <span className="text-white mr-2">$1,000</span>
                    <Button variant="outline" className="bg-app-dark hover:bg-app-light text-white">
                      Change
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Recent Alerts */}
          <div className="mt-8">
            <h2 className="text-lg font-medium text-white mb-4">Recent Alerts</h2>
            
            {isLoading ? (
              <div className="text-center py-10 text-gray-400">Loading alerts...</div>
            ) : (
              <div className="space-y-4">
                {attacksData?.attacks.map((attack) => (
                  <Alert key={attack.id} className={`
                    ${attack.status === 'Confirmed Attack' ? 'bg-red-900/20 border-red-800' : 
                      attack.status === 'Potential Attack' ? 'bg-yellow-900/20 border-yellow-800' : 
                      'bg-app-darker border-gray-700'}
                    rounded-lg
                  `}>
                    <div className="flex items-start">
                      <div className="flex-shrink-0 pt-0.5">
                        <Badge className={`
                          ${attack.status === 'Confirmed Attack' ? 'bg-red-200 text-red-800' : 
                            attack.status === 'Potential Attack' ? 'bg-yellow-200 text-yellow-800' : 
                            'bg-green-200 text-green-800'}
                        `}>
                          {attack.status}
                        </Badge>
                      </div>
                      <div className="ml-3 w-0 flex-1">
                        <div className="text-sm font-medium text-white">
                          {attack.status === 'Confirmed Attack' ? 'Sandwich attack detected' : 
                           attack.status === 'Potential Attack' ? 'Potential sandwich attack' : 
                           'False positive resolved'}
                        </div>
                        <AlertDescription className="mt-1 text-sm text-gray-300">
                          {attack.exchange} - {attack.tokenPair} - Value Extracted: ${attack.valueExtracted.toLocaleString()}
                        </AlertDescription>
                        <div className="mt-2">
                          <Button variant="link" className="text-app-accent hover:text-blue-400 p-0">
                            View Details
                          </Button>
                        </div>
                      </div>
                      <div className="ml-4 flex-shrink-0 self-start flex">
                        <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                          <i className="fas fa-times"></i>
                        </Button>
                      </div>
                    </div>
                  </Alert>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
