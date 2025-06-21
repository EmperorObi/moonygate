import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { UserPlus, Edit3, Trash2 } from "lucide-react";

export default function UserManagementPage() {
  const users = [
    { id: "usr_001", name: "Alice Wonderland", email: "alice@example.com", role: "Admin", status: "Active", avatar: "https://placehold.co/100x100.png?text=AW", dataAiHint: "woman portrait" },
    { id: "usr_002", name: "Bob The Builder", email: "bob@example.com", role: "User", status: "Active", avatar: "https://placehold.co/100x100.png?text=BB", dataAiHint: "man portrait" },
    { id: "usr_003", name: "Charlie Brown", email: "charlie@example.com", role: "User", status: "Inactive", avatar: "https://placehold.co/100x100.png?text=CB", dataAiHint: "person cartoon" },
    { id: "usr_004", name: "Diana Prince", email: "diana@example.com", role: "Editor", status: "Active", avatar: "https://placehold.co/100x100.png?text=DP", dataAiHint: "woman hero" },
  ];

  return (
    <div className="container mx-auto py-8">
      <Card className="shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>User Management</CardTitle>
            <CardDescription>Manage users, roles, and permissions for the CreditFlow Gateway.</CardDescription>
          </div>
          <Button>
            <UserPlus className="mr-2 h-4 w-4" /> Add User
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <Avatar>
                        <AvatarImage src={user.avatar} alt={user.name} data-ai-hint={user.dataAiHint}/>
                        <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{user.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Badge variant={user.role === "Admin" ? "default" : "secondary"}>{user.role}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={user.status === "Active" ? "outline" : "destructive"} className={user.status === "Active" ? "border-green-500 text-green-600" : ""}>
                      {user.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" className="hover:text-accent">
                      <Edit3 className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="hover:text-destructive">
                      <Trash2 className="h-4 w-4" />
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
