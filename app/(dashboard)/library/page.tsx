"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, Button, Badge, Input } from "@/components/ui";
import { Library, Plus, Search, BookOpen, Clock, AlertCircle } from "lucide-react";

export default function LibraryPage() {
  const [books] = useState([
    { id: 1, title: "Higher Mathematics Concepts", author: "S.L. Loney", category: "Mathematics", qty: 5, available: 3, isbn: "978-0-07-066943-9" },
    { id: 2, title: "Advanced Physics Vol 1", author: "H.C. Verma", category: "Physics", qty: 4, available: 4, isbn: "978-81-7764-003-8" },
    { id: 3, title: "English Grammar & Composition", author: "Wren & Martin", category: "English", qty: 8, available: 6, isbn: "978-93-5098-041-3" },
  ]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">Library Books</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Manage book stock, issue logs, and overdue returns</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">Issued Logs</Button>
          <Button size="sm" className="gap-2">
            <Plus className="h-4 w-4" /> Add Book
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search books by title, author, or ISBN..." className="pl-9" />
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {books.map((book) => (
          <Card key={book.id} className="glass-card hover:shadow-lg transition-all">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <Badge variant="secondary">{book.category}</Badge>
                <span className="text-[10px] text-muted-foreground font-mono">{book.isbn}</span>
              </div>
              <CardTitle className="text-base mt-2">{book.title}</CardTitle>
              <p className="text-xs text-muted-foreground">Author: {book.author}</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-2 text-center bg-muted/40 p-2.5 rounded-lg">
                <div>
                  <p className="text-[10px] text-muted-foreground">Total Stock</p>
                  <p className="text-sm font-semibold text-foreground">{book.qty}</p>
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground">Available</p>
                  <p className="text-sm font-semibold text-emerald-500">{book.available}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button size="sm" className="flex-1 text-xs">Issue Book</Button>
                <Button size="sm" variant="outline" className="flex-1 text-xs">Return Book</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
