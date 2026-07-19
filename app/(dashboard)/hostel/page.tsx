"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, Button, Badge } from "@/components/ui";
import { Building2, Plus, BedDouble, UserCheck } from "lucide-react";

export default function HostelPage() {
  const [rooms] = useState([
    { id: 1, roomNo: "101", floor: 1, type: "double", capacity: 2, occupied: 2, fee: 3000, status: "full" },
    { id: 2, roomNo: "102", floor: 1, type: "double", capacity: 2, occupied: 1, fee: 3000, status: "available" },
    { id: 3, roomNo: "103", floor: 1, type: "single", capacity: 1, occupied: 1, fee: 4000, status: "full" },
    { id: 4, roomNo: "201", floor: 2, type: "triple", capacity: 3, occupied: 2, fee: 2500, status: "available" },
  ]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">Hostel Allocations</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Manage dormitory rooms, occupant allocation, and fees</p>
        </div>
        <Button size="sm" className="gap-2">
          <Plus className="h-4 w-4" /> Add Room
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {rooms.map((room) => (
          <Card key={room.id} className="glass-card hover:shadow-lg transition-all">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <Badge variant={room.status === "full" ? "destructive" : "success"}>
                  {room.status === "full" ? "Full" : "Available"}
                </Badge>
                <span className="text-xs text-muted-foreground capitalize">{room.type}</span>
              </div>
              <CardTitle className="text-lg mt-2">Room {room.roomNo}</CardTitle>
              <p className="text-xs text-muted-foreground">Floor: {room.floor}</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-xs text-muted-foreground space-y-1.5">
                <p className="flex items-center gap-1.5"><BedDouble className="h-3.5 w-3.5" /> Capacity: <span className="text-foreground font-semibold">{room.occupied} / {room.capacity} beds</span></p>
                <p className="flex items-center gap-1.5"><UserCheck className="h-3.5 w-3.5" /> Fee: <span className="text-foreground font-semibold">৳{room.fee}/month</span></p>
              </div>
              <div className="pt-2 border-t border-border/50">
                <Button size="sm" className="w-full text-xs" disabled={room.status === "full"}>
                  Allocate Student
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
