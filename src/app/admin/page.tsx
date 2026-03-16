
'use client';

import { StatsDashboard } from "@/components/admin/stats-dashboard";
import { Library, LogOut, Settings, LayoutDashboard, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useUser, useAuth } from "@/firebase";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { signOut } from "firebase/auth";

export default function AdminPage() {
  const { user, loading } = useUser();
  const auth = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  const handleSignOut = async () => {
    await signOut(auth);
    router.push('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="w-64 bg-primary text-primary-foreground flex flex-col hidden lg:flex sticky top-0 h-screen">
        <div className="p-6 flex items-center gap-2 mb-8">
          <Library className="h-8 w-8" />
          <h1 className="text-2xl font-headline font-bold">NEULib</h1>
        </div>
        
        <nav className="flex-grow px-4 space-y-2">
          <Button variant="secondary" className="w-full justify-start gap-3 bg-white/10 hover:bg-white/20 text-white border-0">
            <LayoutDashboard className="h-5 w-5" />
            Dashboard
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-3 hover:bg-white/10 text-white/70">
            <Settings className="h-5 w-5" />
            System Settings
          </Button>
        </nav>

        <div className="p-6 border-t border-white/10">
          <Button 
            variant="ghost" 
            className="w-full justify-start gap-3 text-white/70 hover:text-white hover:bg-white/10"
            onClick={handleSignOut}
          >
            <LogOut className="h-5 w-5" />
            Sign Out
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 lg:p-12 overflow-y-auto">
        <header className="flex items-center justify-between mb-8">
          <div>
            <p className="text-muted-foreground text-sm">Library Administrator Portal</p>
            <h2 className="text-2xl font-headline font-semibold">Welcome back, {user.displayName || 'Admin'}</h2>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium">{user.displayName || 'Administrator'}</p>
              <p className="text-xs text-muted-foreground">{user.email}</p>
            </div>
          </div>
        </header>

        <StatsDashboard />
      </main>
    </div>
  );
}
