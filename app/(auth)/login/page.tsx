"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  School, GraduationCap, Users, UserRound,
  Heart, Eye, EyeOff, Lock, Mail, Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { APP_NAME } from "@/lib/constants";

type Role = "admin" | "teacher" | "student" | "parent";

const roles: { value: Role; label: string; icon: React.ComponentType<{ className?: string }>; color: string; description: string }[] = [
  {
    value: "admin",
    label: "Admin",
    icon: UserRound,
    color: "from-blue-500 to-indigo-600",
    description: "Full system access",
  },
  {
    value: "teacher",
    label: "Teacher",
    icon: GraduationCap,
    color: "from-emerald-500 to-teal-600",
    description: "Classes & attendance",
  },
  {
    value: "student",
    label: "Student",
    icon: School,
    color: "from-violet-500 to-purple-600",
    description: "Results & schedule",
  },
  {
    value: "parent",
    label: "Parent",
    icon: Heart,
    color: "from-rose-500 to-pink-600",
    description: "Child's progress",
  },
];

// Demo credentials
const demoCredentials: Record<Role, { email: string; password: string }> = {
  admin: { email: "admin@smartschool.com", password: "admin123" },
  teacher: { email: "teacher@smartschool.com", password: "teacher123" },
  student: { email: "student@smartschool.com", password: "student123" },
  parent: { email: "parent@smartschool.com", password: "parent123" },
};

export default function LoginPage() {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState<Role>("admin");
  const [email, setEmail] = useState("admin@smartschool.com");
  const [password, setPassword] = useState("admin123");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleRoleSelect = (role: Role) => {
    setSelectedRole(role);
    setEmail(demoCredentials[role].email);
    setPassword(demoCredentials[role].password);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        role: selectedRole,
        redirect: false,
      });

      if (result?.error) {
        toast.error("Invalid credentials. Please try again.");
      } else {
        toast.success(`Welcome back! Logged in as ${selectedRole}.`);
        router.push("/dashboard");
        router.refresh();
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const selectedRoleData = roles.find((r) => r.value === selectedRole)!;

  return (
    <div className="min-h-screen relative flex items-center justify-center overflow-hidden bg-background">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-primary/10 blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-violet-500/10 blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-64 w-64 rounded-full bg-primary/5 blur-2xl" />
      </div>

      {/* Grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.015] dark:opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(hsl(var(--foreground)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)`,
          backgroundSize: "48px 48px",
        }}
      />

      <div className="relative z-10 w-full max-w-md px-6 py-10">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl gradient-brand shadow-lg shadow-primary/30 mb-4">
            <School className="h-7 w-7 text-white" />
          </div>
          <h1 className="font-display text-2xl font-bold text-foreground">{APP_NAME}</h1>
          <p className="text-sm text-muted-foreground mt-1">Sign in to your account</p>
        </motion.div>

        {/* Role Selector */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-4 gap-2 mb-6"
        >
          {roles.map((role) => {
            const Icon = role.icon;
            const isSelected = selectedRole === role.value;
            return (
              <button
                key={role.value}
                onClick={() => handleRoleSelect(role.value)}
                className={cn(
                  "flex flex-col items-center gap-1.5 rounded-xl p-3 text-xs font-medium transition-all duration-200 border",
                  isSelected
                    ? "border-primary/50 bg-primary/10 text-primary scale-105"
                    : "border-border bg-card text-muted-foreground hover:border-primary/30 hover:text-foreground"
                )}
              >
                <div className={cn(
                  "h-8 w-8 rounded-lg flex items-center justify-center bg-gradient-to-br text-white transition-all",
                  isSelected ? role.color : "from-muted to-muted text-muted-foreground"
                )}>
                  <Icon className="h-4 w-4" />
                </div>
                {role.label}
              </button>
            );
          })}
        </motion.div>

        {/* Login Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card p-6"
        >
          <div className="mb-5">
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedRole}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="flex items-center gap-2"
              >
                <div className={cn("h-7 w-7 rounded-lg bg-gradient-to-br flex items-center justify-center text-white text-xs", selectedRoleData.color)}>
                  <selectedRoleData.icon className="h-3.5 w-3.5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground capitalize">{selectedRole} Login</p>
                  <p className="text-xs text-muted-foreground">{selectedRoleData.description}</p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-foreground">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full h-10 rounded-lg border border-input bg-background pl-9 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-ring text-foreground"
                  placeholder="your@email.com"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-foreground">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full h-10 rounded-lg border border-input bg-background pl-9 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-ring text-foreground"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-10 rounded-lg gradient-brand text-white text-sm font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-60"
            >
              {loading ? (
                <><Loader2 className="h-4 w-4 animate-spin" /> Signing in...</>
              ) : (
                `Sign in as ${selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1)}`
              )}
            </button>
          </form>

          {/* Demo hint */}
          <p className="text-center text-xs text-muted-foreground mt-4">
            Demo credentials auto-filled. Click &quot;Sign in&quot; to continue.
          </p>
        </motion.div>

        {/* Footer credit */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-center text-xs text-muted-foreground mt-6"
        >
          Built with ❤️ by{" "}
          <a href="https://devistiak.eu.cc" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
            Istiak Rahman
          </a>
          {" · "}
          <a href="https://github.com/istiakrahman15" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
            GitHub
          </a>
        </motion.p>
      </div>
    </div>
  );
}
