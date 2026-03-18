'use client';

import React, { useState, useEffect } from "react";
import { StatsDashboard } from "@/components/admin/stats-dashboard";
import { UserManagement } from "@/components/admin/user-management";
import { Library, LogOut, Settings, LayoutDashboard, Loader2, Users, UserCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUser, useAuth } from "@/firebase";
import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

type AdminView = 'dashboard' | 'users' | 'settings';

export default function AdminPage() {
  const { user, isUserLoading, isAdmin, isAdminLoading } = useUser();
  const auth = useAuth();
  const router = useRouter();
  const [currentView, setCurrentView] = useState<AdminView>('dashboard');

  const campusImage = PlaceHolderImages.find(img => img.id === 'hero-library');

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/login');
    }
  }, [user, isUserLoading, router]);

  const handleSignOut = async () => {
    await signOut(auth);
    router.push('/');
  };

  if (isUserLoading || isAdminLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-10 w-10 animate-spin text-primary mx-auto" />
          <p className="text-muted-foreground animate-pulse">Verifying Security Credentials...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  // Role-based access control check
  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center space-y-6 bg-white p-8 rounded-xl shadow-2xl border border-destructive/20">
          <div className="h-20 w-20 bg-destructive/10 text-destructive rounded-full flex items-center justify-center mx-auto">
            <Library className="h-10 w-10" />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-primary font-headline">Access Restricted</h1>
            <p className="text-muted-foreground">
              Your account does not have administrative privileges. Please contact the system administrator for access.
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <Link href="/user">
              <Button className="w-full bg-primary hover:bg-primary/90">Go to User Portal</Button>
            </Link>
            <Button variant="ghost" onClick={handleSignOut} className="w-full text-muted-foreground">
              Sign Out
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen overflow-hidden">
      {/* Background Layer */}
      <div className="fixed inset-0 z-0">
        {campusImage && (
          <Image
            src={campusImage.imageUrl}
            alt="Campus Background"
            fill
            className="object-cover"
            priority
          />
        )}
        <div className="absolute inset-0 bg-white/90 backdrop-blur-[2px]" />
      </div>

      {/* Sidebar */}
      <aside className="w-72 bg-primary text-primary-foreground flex flex-col hidden lg:flex sticky top-0 h-screen shadow-2xl z-20">
        <div className="p-8 flex items-center gap-3 mb-4 border-b border-white/10">
          <div className="bg-white/20 p-2 rounded-lg">
            <Library className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-headline font-bold tracking-tight">NEULib</h1>
            <Badge variant="secondary" className="bg-white/10 text-[10px] text-white/70 hover:bg-white/20 border-0">SYSTEM ADMIN</Badge>
          </div>
        </div>
        
        <nav className="flex-grow px-4 space-y-2 py-4">
          <Button 
            variant="ghost" 
            className={cn(
              "w-full justify-start gap-4 transition-all h-12 text-base",
              currentView === 'dashboard' ? "bg-white/20 text-white shadow-md" : "text-white/70 hover:bg-white/10 hover:text-white"
            )}
            onClick={() => setCurrentView('dashboard')}
          >
            <LayoutDashboard className="h-5 w-5" />
            Analytics Overview
          </Button>
          <Button 
            variant="ghost" 
            className={cn(
              "w-full justify-start gap-4 transition-all h-12 text-base",
              currentView === 'users' ? "bg-white/20 text-white shadow-md" : "text-white/70 hover:bg-white/10 hover:text-white"
            )}
            onClick={() => setCurrentView('users')}
          >
            <Users className="h-5 w-5" />
            User Management
          </Button>
          <Button 
            variant="ghost" 
            className={cn(
              "w-full justify-start gap-4 transition-all h-12 text-base",
              currentView === 'settings' ? "bg-white/20 text-white shadow-md" : "text-white/70 hover:bg-white/10 hover:text-white"
            )}
            onClick={() => setCurrentView('settings')}
          >
            <Settings className="h-5 w-5" />
            System Configuration
          </Button>
        </nav>

        <div className="p-6 border-t border-white/10 space-y-3 bg-black/5">
          <Button 
            variant="ghost" 
            className="w-full justify-start gap-3 text-white/50 hover:text-white hover:bg-white/10 h-10"
            onClick={handleSignOut}
          >
            <LogOut className="h-4 w-4" />
            Logout System
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 lg:p-10 overflow-y-auto relative z-10">
        <header className="flex flex-col sm:flex-row sm:items-center justify-between mb-10 gap-4 pb-6 border-b border-primary/10">
          <div>
            <p className="text-muted-foreground text-xs uppercase tracking-widest font-bold mb-1">
              Admin Control Panel
            </p>
            <h2 className="text-3xl font-headline font-bold text-primary">
              {currentView === 'dashboard' && "System Analytics"}
              {currentView === 'users' && "Community Records"}
              {currentView === 'settings' && "Configuration"}
            </h2>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="hidden md:flex flex-col items-end">
              <p className="text-sm font-bold text-primary">{user.displayName || 'Administrator'}</p>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{user.email}</p>
            </div>
            
            <div className="h-12 w-12 rounded-xl bg-primary shadow-lg flex items-center justify-center text-white font-bold border-2 border-white/50">
              {(user.displayName || user.email || 'A')[0].toUpperCase()}
            </div>
          </div>
        </header>

        <div className="animate-in fade-in slide-in-from-bottom-2 duration-700">
          {currentView === 'dashboard' && <StatsDashboard />}
          {currentView === 'users' && <UserManagement />}
          {currentView === 'settings' && (
            <div className="flex flex-col items-center justify-center h-[50vh] text-muted-foreground">
              <div className="text-center space-y-4 max-w-sm">
                <div className="h-20 w-20 bg-muted rounded-full flex items-center justify-center mx-auto opacity-40">
                  <Settings className="h-10 w-10" />
                </div>
                <h3 className="text-xl font-bold text-primary">Under Optimization</h3>
                <p className="text-sm">Advanced system parameters and API configurations are currently locked for maintenance.</p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}