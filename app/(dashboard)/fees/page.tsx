"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, Button, Badge, Input } from "@/components/ui";
import { CreditCard, Plus, ArrowUpRight, DollarSign, Wallet } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

export default function FeesPage() {
  const [fees] = useState([
    { id: 1, studentName: "Rahim Ahmed", studentId: "STU-2026-0001", amount: 2500, type: "tuition", status: "paid", dueDate: "2026-07-10" },
    { id: 2, studentName: "Fatema Khatun", studentId: "STU-2026-0002", amount: 2500, type: "tuition", status: "pending", dueDate: "2026-07-10" },
    { id: 3, studentName: "Karim Hossain", studentId: "STU-2026-0003", amount: 1500, type: "transport", status: "overdue", dueDate: "2026-07-05" },
  ]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">Fees & Payments</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Collect fees, setup payouts, and track payment transactions</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">Setup Structure</Button>
          <Button size="sm" className="gap-2">
            <Plus className="h-4 w-4" /> Collect Fee
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="glass-card">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground font-medium">Total Collected</p>
              <p className="text-xl font-bold font-display mt-1">{formatCurrency(650000)}</p>
            </div>
            <div className="h-10 w-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
              <DollarSign className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground font-medium">Pending Invoices</p>
              <p className="text-xl font-bold font-display mt-1">{formatCurrency(12500)}</p>
            </div>
            <div className="h-10 w-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
              <Wallet className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground font-medium">Overdue Collections</p>
              <p className="text-xl font-bold font-display mt-1">{formatCurrency(7500)}</p>
            </div>
            <div className="h-10 w-10 rounded-xl bg-red-500/10 text-red-500 flex items-center justify-center">
              <CreditCard className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Transactions List</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border text-left">
                  <th className="px-6 py-3 text-xs font-semibold text-muted-foreground">Student</th>
                  <th className="px-6 py-3 text-xs font-semibold text-muted-foreground">Fee Type</th>
                  <th className="px-6 py-3 text-xs font-semibold text-muted-foreground">Amount</th>
                  <th className="px-6 py-3 text-xs font-semibold text-muted-foreground">Due Date</th>
                  <th className="px-6 py-3 text-xs font-semibold text-muted-foreground">Status</th>
                  <th className="px-6 py-3 text-xs font-semibold text-muted-foreground text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {fees.map((fee) => (
                  <tr key={fee.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm font-medium text-foreground">{fee.studentName}</p>
                        <p className="text-xs text-muted-foreground">{fee.studentId}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm capitalize">{fee.type}</td>
                    <td className="px-6 py-4 text-sm font-medium">{formatCurrency(fee.amount)}</td>
                    <td className="px-6 py-4 text-xs text-muted-foreground">{fee.dueDate}</td>
                    <td className="px-6 py-4">
                      <Badge variant={fee.status === "paid" ? "success" : fee.status === "pending" ? "warning" : "destructive"}>
                        {fee.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Button size="sm" variant="ghost" className="text-xs text-primary">
                        Collect
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
