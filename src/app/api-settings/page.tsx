import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Shield, Zap, Lock } from "lucide-react";

export default function ApiSettingsPage() {
  return (
    <div className="container mx-auto py-8 space-y-8">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>API Settings</CardTitle>
          <CardDescription>Configure rate limiting, security policies, and other API gateway settings.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Rate Limiting Section */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Zap className="h-6 w-6 text-primary" />
              <h3 className="text-lg font-semibold">Rate Limiting</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="globalRps">Global Requests Per Second (RPS)</Label>
                <Input id="globalRps" type="number" defaultValue="100" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ipRpm">Per-IP Requests Per Minute (RPM)</Label>
                <Input id="ipRpm" type="number" defaultValue="60" />
              </div>
            </div>
            <div className="mt-4 flex items-center space-x-2">
              <Switch id="enableBurst" defaultChecked />
              <Label htmlFor="enableBurst">Enable Burst Allowance (allow temporary spikes)</Label>
            </div>
          </div>

          <Separator />

          {/* Security Policies Section */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Shield className="h-6 w-6 text-primary" />
              <h3 className="text-lg font-semibold">Security Policies</h3>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 border rounded-md">
                <Label htmlFor="enableWaf">Enable Web Application Firewall (WAF)</Label>
                <Switch id="enableWaf" defaultChecked />
              </div>
              <div className="flex items-center justify-between p-3 border rounded-md">
                <Label htmlFor="enableCors">Enforce Strict CORS Policy</Label>
                <Switch id="enableCors" defaultChecked />
              </div>
              <div className="flex items-center justify-between p-3 border rounded-md">
                <Label htmlFor="blockSuspiciousIps">Automatically Block Suspicious IPs</Label>
                <Switch id="blockSuspiciousIps" />
              </div>
            </div>
            <div className="mt-4 space-y-2">
                <Label htmlFor="allowedOrigins">Allowed CORS Origins (comma-separated)</Label>
                <Input id="allowedOrigins" placeholder="https://app.example.com, https://mobile.example.com" />
            </div>
          </div>
          
          <Separator />

          {/* API Key Management Section */}
           <div>
            <div className="flex items-center space-x-2 mb-4">
              <Lock className="h-6 w-6 text-primary" />
              <h3 className="text-lg font-semibold">API Key Management</h3>
            </div>
             <p className="text-sm text-muted-foreground mb-4">Configure and manage API keys for external services accessing the gateway.</p>
            <Button>Manage API Keys</Button>
          </div>

        </CardContent>
        <CardFooter>
          <Button className="ml-auto">Save Settings</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
