import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, ShieldCheck, Network, Users, TrendingUp, AlertTriangle, FileText } from "lucide-react";

export default function DashboardPage() {
  const gatewayStats = [
    { title: "API Requests (24h)", value: "1.2M", icon: TrendingUp, description: "+5.2% from yesterday" },
    { title: "Average Latency", value: "45ms", icon: Activity, description: "Within SLO" },
    { title: "Error Rate", value: "0.02%", icon: AlertTriangle, description: "Stable" },
    { title: "Active Users", value: "1,523", icon: Users, description: "Real-time count" },
    { title: "Services Connected", value: "5", icon: Network, description: "All services operational" },
    { title: "Security Events (24h)", value: "3", icon: ShieldCheck, description: "Low severity" },
  ];

  const recentActivityItems = [
    { event: "New user 'john.doe' registered.", time: "2 mins ago", icon: Users },
    { event: "Credit report processed for user 'jane.smith'.", time: "5 mins ago", icon: FileText },
    { event: "Rate limit warning for IP 192.168.1.100.", time: "15 mins ago", icon: AlertTriangle },
    { event: "Service 'AI-Summarizer' scaled up.", time: "30 mins ago", icon: TrendingUp },
  ];

  const systemHealthServices = [
    { name: "User Authentication", status: "Operational", color: "bg-green-500" },
    { name: "AI Core: Summarizer", status: "Operational", color: "bg-green-500" },
    { name: "AI Core: Dispute Letters", status: "Operational", color: "bg-green-500" },
    { name: "File Storage Service", status: "Degraded Performance", color: "bg-yellow-500" },
    { name: "Notification Service", status: "Operational", color: "bg-green-500" },
  ];

  return (
    <div className="container mx-auto py-8">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {gatewayStats.map((stat) => (
          <Card key={stat.title} className="shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              {stat.icon && <stat.icon className="h-5 w-5 text-muted-foreground" />}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-12 grid gap-6 lg:grid-cols-2">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Overview of recent gateway events.</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {recentActivityItems.map((item, index) => (
                <li key={index} className="flex items-center space-x-3">
                  {item.icon && <item.icon className="h-5 w-5 text-primary" />}
                  <div>
                    <p className="text-sm font-medium">{item.event}</p>
                    <p className="text-xs text-muted-foreground">{item.time}</p>
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>System Health</CardTitle>
            <CardDescription>Status of integrated microservices.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {systemHealthServices.map((service) => (
                <div key={service.name} className="flex items-center justify-between">
                  <span className="text-sm">{service.name}</span>
                  <div className="flex items-center space-x-2">
                    <span className={`h-3 w-3 rounded-full ${service.color}`}></span>
                    <span className="text-xs text-muted-foreground">{service.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
