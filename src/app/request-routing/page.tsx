import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Network, Route, PlusCircle, Edit } from "lucide-react";

export default function RequestRoutingPage() {
  const routes = [
    { id: "route_001", pathPrefix: "/api/users", service: "User Management Microservice", method: "ANY", status: "Active" },
    { id: "route_002", pathPrefix: "/api/reports", service: "File Processing Microservice", method: "POST", status: "Active" },
    { id: "route_003", pathPrefix: "/api/ai/summarize", service: "AI Core (Summarizer)", method: "POST", status: "Active" },
    { id: "route_004", pathPrefix: "/api/ai/dispute", service: "AI Core (Dispute Generator)", method: "POST", status: "Active" },
    { id: "route_005", pathPrefix: "/api/notifications", service: "Notification Microservice", method: "ANY", status: "Maintenance" },
    { id: "route_006", pathPrefix: "/auth", service: "Authentication Service", method: "ANY", status: "Active" },
  ];

  return (
    <div className="container mx-auto py-8 space-y-8">
      <Card className="shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Request Routing</CardTitle>
            <CardDescription>
              Manage and visualize how incoming API requests are routed to backend services.
            </CardDescription>
          </div>
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" /> Add New Route
          </Button>
        </CardHeader>
        <CardContent>
          <div className="mb-6 p-4 border rounded-md bg-muted/50">
            <h4 className="font-semibold text-md mb-2 flex items-center"><Network className="mr-2 h-5 w-5 text-primary"/> Gateway Entry Point</h4>
            <p className="text-sm">All requests to <code className="px-1 py-0.5 bg-primary/10 text-primary rounded-sm">https://gateway.creditflow.app/*</code> are processed here.</p>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Path Prefix</TableHead>
                <TableHead>HTTP Method</TableHead>
                <TableHead>Target Service</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {routes.map((route) => (
                <TableRow key={route.id}>
                  <TableCell className="font-medium flex items-center">
                     <Route className="mr-2 h-4 w-4 text-muted-foreground" /> {route.pathPrefix}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{route.method}</Badge>
                  </TableCell>
                  <TableCell>{route.service}</TableCell>
                  <TableCell>
                    <Badge variant={route.status === "Active" ? "default" : "destructive"} className={route.status === "Active" ? "bg-green-500/20 text-green-700 border-green-400" : "bg-yellow-500/20 text-yellow-700 border-yellow-400"}>
                        {route.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" className="hover:text-accent">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
