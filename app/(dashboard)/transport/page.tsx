"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, Button, Badge } from "@/components/ui";
import { Bus, Plus, Phone, Navigation } from "lucide-react";

export default function TransportPage() {
  const [routes] = useState([
    { id: 1, name: "Dhanmondi Route", driver: "Mr. Alam", phone: "01712345690", vehicle: "Bus (DHA-1234)", fee: 1500, active: true },
    { id: 2, name: "Gulshan Route", driver: "Mr. Bashir", phone: "01712345691", vehicle: "Bus (GUL-5678)", fee: 1800, active: true },
    { id: 3, name: "Mirpur Route", driver: "Mr. Jabbar", phone: "01712345692", vehicle: "Minibus (MIR-9012)", fee: 1200, active: true },
  ]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">Transport Routes</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Manage school buses, drivers, and pickup route fees</p>
        </div>
        <Button size="sm" className="gap-2">
          <Plus className="h-4 w-4" /> Add Route
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {routes.map((route) => (
          <Card key={route.id} className="glass-card hover:shadow-lg transition-all">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <Badge variant={route.active ? "success" : "secondary"}>
                  {route.active ? "Active" : "Inactive"}
                </Badge>
                <span className="text-xs font-semibold text-primary">৳{route.fee}/month</span>
              </div>
              <CardTitle className="text-base mt-2">{route.name}</CardTitle>
              <p className="text-xs text-muted-foreground">Vehicle: {route.vehicle}</p>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-xs text-muted-foreground space-y-1">
                <p className="flex items-center gap-1.5"><Navigation className="h-3.5 w-3.5" /> Driver: <span className="text-foreground font-medium">{route.driver}</span></p>
                <p className="flex items-center gap-1.5"><Phone className="h-3.5 w-3.5" /> Contact: <span className="text-foreground font-medium">{route.phone}</span></p>
              </div>
              <div className="flex gap-2 pt-2 border-t border-border/50">
                <Button size="sm" className="flex-1 text-xs">Assign Student</Button>
                <Button size="sm" variant="outline" className="flex-1 text-xs">Edit Details</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
