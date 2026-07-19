"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, Button, Input } from "@/components/ui";
import { Settings, Save } from "lucide-react";
import { toast } from "sonner";

export default function SettingsPage() {
  const [saving, setSaving] = useState(false);
  const [schoolName, setSchoolName] = useState("SmartSchool Academy");
  const [address, setAddress] = useState("123 Education Road, Dhaka-1215");
  const [phone, setPhone] = useState("02-9123456");
  const [email, setEmail] = useState("info@smartschool.com");

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      toast.success("Settings updated successfully!");
    }, 800);
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="font-display text-2xl font-bold text-foreground">Settings</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Configure school institution details and global options</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Institution Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium">School Name</label>
              <Input value={schoolName} onChange={(e) => setSchoolName(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium">Contact Phone</label>
              <Input value={phone} onChange={(e) => setPhone(e.target.value)} />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-xs font-medium">Contact Email</label>
              <Input value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-xs font-medium">Address</label>
              <Input value={address} onChange={(e) => setAddress(e.target.value)} />
            </div>
          </div>
          <div className="flex justify-end pt-4 border-t border-border">
            <Button onClick={handleSave} loading={saving} className="gap-2">
              <Save className="h-4 w-4" /> Save Settings
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
