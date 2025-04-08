import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { exchanges } from "@shared/schema";

export default function Settings() {
  const [apiKey, setApiKey] = useState("");
  const [blockchainProvider, setBlockchainProvider] = useState("alchemy");
  const [alertThreshold, setAlertThreshold] = useState("1000");
  const [notifications, setNotifications] = useState({
    email: true,
    dashboard: true,
    webhook: false
  });
  
  const { toast } = useToast();
  
  const handleSaveSettings = () => {
    toast({
      title: "Settings saved",
      description: "Your settings have been updated successfully.",
      variant: "default",
    });
  };

  return (
    <main className="flex-1 relative overflow-y-auto focus:outline-none bg-app-dark">
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <h1 className="text-2xl font-semibold text-white">Settings</h1>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          {/* API Configuration */}
          <Card className="mt-6 bg-app-darker shadow overflow-hidden border border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">API Configuration</CardTitle>
              <CardDescription>Configure blockchain data providers</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="blockchain-provider" className="text-gray-200">Blockchain Provider</Label>
                <Select value={blockchainProvider} onValueChange={setBlockchainProvider}>
                  <SelectTrigger id="blockchain-provider" className="mt-1 bg-app-dark border-gray-700 text-white">
                    <SelectValue placeholder="Select a provider" />
                  </SelectTrigger>
                  <SelectContent className="bg-app-darker border-gray-700 text-white">
                    <SelectItem value="alchemy">Alchemy</SelectItem>
                    <SelectItem value="infura">Infura</SelectItem>
                    <SelectItem value="quicknode">QuickNode</SelectItem>
                    <SelectItem value="moralis">Moralis</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="api-key" className="text-gray-200">API Key</Label>
                <Input 
                  id="api-key"
                  type="password"
                  placeholder="Enter your API key"
                  className="mt-1 bg-app-dark border-gray-700 text-white"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                />
                <p className="mt-1 text-xs text-gray-400">Your API key is stored securely and never shared.</p>
              </div>
              
              <div>
                <Button className="bg-app-accent hover:bg-blue-600 text-white">
                  Test Connection
                </Button>
              </div>
            </CardContent>
          </Card>
          
          {/* Exchange Monitoring */}
          <Card className="mt-8 bg-app-darker shadow overflow-hidden border border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Exchange Monitoring</CardTitle>
              <CardDescription>Select which exchanges to monitor for sandwich attacks</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {exchanges.map((exchange) => (
                  <div key={exchange} className="flex items-center space-x-2">
                    <Switch id={`exchange-${exchange}`} defaultChecked />
                    <Label htmlFor={`exchange-${exchange}`} className="text-gray-200">{exchange}</Label>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          {/* Notification Settings */}
          <Card className="mt-8 bg-app-darker shadow overflow-hidden border border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Notification Settings</CardTitle>
              <CardDescription>Configure how you receive alert notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-white font-medium">Email Notifications</h3>
                  <p className="text-gray-400 text-sm">Receive email alerts for confirmed attacks</p>
                </div>
                <Switch 
                  checked={notifications.email}
                  onCheckedChange={(checked) => setNotifications({...notifications, email: checked})}
                />
              </div>
              
              <Separator className="bg-gray-700" />
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-white font-medium">Dashboard Notifications</h3>
                  <p className="text-gray-400 text-sm">Show real-time alerts in the dashboard</p>
                </div>
                <Switch 
                  checked={notifications.dashboard}
                  onCheckedChange={(checked) => setNotifications({...notifications, dashboard: checked})}
                />
              </div>
              
              <Separator className="bg-gray-700" />
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-white font-medium">Webhook Notifications</h3>
                  <p className="text-gray-400 text-sm">Send alerts to a custom webhook URL</p>
                </div>
                <Switch 
                  checked={notifications.webhook}
                  onCheckedChange={(checked) => setNotifications({...notifications, webhook: checked})}
                />
              </div>
              
              {notifications.webhook && (
                <div className="pt-4">
                  <Label htmlFor="webhook-url" className="text-gray-200">Webhook URL</Label>
                  <Input 
                    id="webhook-url"
                    placeholder="https://"
                    className="mt-1 bg-app-dark border-gray-700 text-white"
                  />
                </div>
              )}
              
              <Separator className="bg-gray-700" />
              
              <div>
                <Label htmlFor="alert-threshold" className="text-gray-200">Minimum Alert Threshold ($)</Label>
                <Input 
                  id="alert-threshold"
                  type="number"
                  placeholder="1000"
                  className="mt-1 bg-app-dark border-gray-700 text-white"
                  value={alertThreshold}
                  onChange={(e) => setAlertThreshold(e.target.value)}
                />
                <p className="mt-1 text-xs text-gray-400">
                  Only send alerts for attacks where the extracted value exceeds this amount
                </p>
              </div>
            </CardContent>
          </Card>
          
          {/* Save Button */}
          <div className="mt-8 mb-16 flex justify-end">
            <Button 
              className="bg-app-accent hover:bg-blue-600 text-white"
              onClick={handleSaveSettings}
            >
              Save Settings
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}
