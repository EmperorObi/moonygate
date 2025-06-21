import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShieldCheck, AlertTriangle, ListChecks, FileLock2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";

export default function SecurityPage() {
  const securityChecks = [
    { id: "waf", name: "Web Application Firewall (WAF)", status: "Enabled", details: "Actively blocking malicious requests." },
    { id: "ddos", name: "DDoS Mitigation", status: "Active", details: "Traffic scrubbing enabled." },
    { id: "authz", name: "Authorization Policies", status: "Enforced", details: "Role-based access control active." },
    { id: "encryption", name: "Data Encryption (TLS 1.3)", status: "Active", details: "All external communication encrypted." },
    { id: "audit", name: "Audit Logs", status: "Enabled", details: "All critical actions are logged." },
  ];

  return (
    <div className="container mx-auto py-8 space-y-8">
      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex items-center space-x-3">
            <ShieldCheck className="h-8 w-8 text-primary" />
            <div>
              <CardTitle>Security Overview</CardTitle>
              <CardDescription>Monitor and manage the security posture of CreditFlow Gateway.</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Overall Security Score</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center space-y-2">
                <div className="text-5xl font-bold text-green-600">92%</div>
                <Progress value={92} className="w-full h-3" />
                <p className="text-sm text-muted-foreground">Excellent</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Recent Security Alerts</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-start space-x-2">
                    <AlertTriangle className="h-5 w-5 text-yellow-500 mt-1" />
                    <div>
                      <p className="text-sm font-medium">Unusual login attempt from unrecognized IP.</p>
                      <p className="text-xs text-muted-foreground">2 hours ago - Low severity</p>
                    </div>
                  </li>
                  <li className="flex items-start space-x-2">
                    <ShieldCheck className="h-5 w-5 text-green-500 mt-1" />
                     <div>
                      <p className="text-sm font-medium">Malicious payload blocked by WAF.</p>
                      <p className="text-xs text-muted-foreground">5 hours ago - Action taken</p>
                    </div>
                  </li>
                </ul>
                <Button variant="link" className="p-0 h-auto mt-2">View all alerts</Button>
              </CardContent>
            </Card>
          </div>
          
          <div>
            <h3 className="text-xl font-semibold mb-4 flex items-center"><ListChecks className="mr-2 h-5 w-5 text-primary"/>Security Checks & Best Practices</h3>
            <div className="space-y-3">
              {securityChecks.map(check => (
                <Card key={check.id} className="bg-muted/30">
                  <CardContent className="p-4 flex items-center justify-between">
                    <div>
                      <p className="font-medium">{check.name}</p>
                      <p className="text-xs text-muted-foreground">{check.details}</p>
                    </div>
                    <span className={`px-3 py-1 text-xs rounded-full ${check.status === "Enabled" || check.status === "Active" || check.status === "Enforced" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                      {check.status}
                    </span>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <div className="mt-6">
            <h3 className="text-xl font-semibold mb-4 flex items-center"><FileLock2 className="mr-2 h-5 w-5 text-primary"/>Data Protection</h3>
            <p className="text-sm text-muted-foreground mb-2">
              Sensitive data, such as uploaded credit reports, is handled with care. Files are temporarily stored securely and processed by AI models. Ensure compliance with relevant data privacy regulations.
            </p>
            <Button variant="outline">Review Data Handling Policy</Button>
          </div>

        </CardContent>
      </Card>
    </div>
  );
}
