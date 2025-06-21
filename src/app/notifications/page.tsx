import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BellRing, Send, History, Settings2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function NotificationsPage() {
  const recentNotifications = [
    { id: "notif_001", type: "Credit Report Processed", recipient: "user_jane_doe", channel: "Push", status: "Sent", time: "2024-07-28 10:20 AM" },
    { id: "notif_002", type: "Dispute Letter Ready", recipient: "user_john_smith", channel: "Email, Push", status: "Delivered", time: "2024-07-28 09:15 AM" },
    { id: "notif_003", type: "Account Security Alert", recipient: "admin_ops", channel: "SMS", status: "Failed", time: "2024-07-27 18:00 PM" },
  ];

  return (
    <div className="container mx-auto py-8 space-y-8">
      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex items-center space-x-3">
            <BellRing className="h-8 w-8 text-primary" />
            <div>
              <CardTitle>Notifications Management</CardTitle>
              <CardDescription>Manage and send push notifications, emails, and other alerts to users.</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="send" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="send"><Send className="mr-2 h-4 w-4" />Send Notification</TabsTrigger>
              <TabsTrigger value="history"><History className="mr-2 h-4 w-4" />History</TabsTrigger>
              <TabsTrigger value="settings"><Settings2 className="mr-2 h-4 w-4" />Settings</TabsTrigger>
            </TabsList>
            
            <TabsContent value="send">
              <Card>
                <CardHeader>
                  <CardTitle>Compose Notification</CardTitle>
                  <CardDescription>Send a one-time notification to a user or group.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="recipient">Recipient (User ID or Group)</Label>
                    <Input id="recipient" placeholder="e.g., user_xyz123 or 'all_users'" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Input id="title" placeholder="Notification Title" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea id="message" placeholder="Enter your notification message here..." />
                  </div>
                  {/* Placeholder for channel selection, e.g., Push, Email, SMS */}
                </CardContent>
                <CardFooter>
                  <Button className="ml-auto"><Send className="mr-2 h-4 w-4" /> Send</Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="history">
              <Card>
                <CardHeader>
                  <CardTitle>Notification History</CardTitle>
                  <CardDescription>View logs of recently sent notifications.</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {recentNotifications.map(n => (
                      <li key={n.id} className="p-3 border rounded-md bg-muted/30">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium">{n.type}</p>
                            <p className="text-xs text-muted-foreground">To: {n.recipient} via {n.channel}</p>
                          </div>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${n.status === "Sent" || n.status === "Delivered" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>{n.status}</span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">{n.time}</p>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings">
              <Card>
                <CardHeader>
                  <CardTitle>Notification Settings</CardTitle>
                  <CardDescription>Configure notification channels and templates (mocked).</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    This section would typically allow configuration of Push Notification services (FCM, APNS), Email gateways (SendGrid, SES), SMS providers, and notification templates.
                  </p>
                  <Button variant="outline">Configure Push Channels</Button>
                  <Button variant="outline">Manage Email Templates</Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
