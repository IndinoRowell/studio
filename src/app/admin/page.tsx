'use client';

import React, { useState, useEffect } from "react";
import { StatsDashboard } from "@/components/admin/stats-dashboard";
import { UserManagement } from "@/components/admin/user-management";
import { Library, LogOut, Settings, LayoutDashboard, Loader2, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUser, useAuth } from "@/firebase";
import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";

type AdminView = 'dashboard' | 'users' | 'settings';

export default function AdminPage(props: {
  params: Promise<any>;
  searchParams: Promise<any>;
}) {
  const params = React.use(props.params);
  const searchParams = React.use(props.searchParams);
  
  const { user, loading } = useUser();
  const auth = useAuth();
  const router = useRouter();
  const [currentView, setCurrentView] = useState<AdminView>('dashboard');

  const campusImage = PlaceHolderImages.find(img => img.id === 'hero-library');

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
        {/* Semi-transparent white overlay to ensure contrast while keeping the image visible */}
        <div className="absolute inset-0 bg-white/80 backdrop-blur-[1px]" />
      </div>

      {/* Sidebar - Reverted to solid primary */}
      <aside className="w-64 bg-primary text-primary-foreground flex flex-col hidden lg:flex sticky top-0 h-screen shadow-2xl z-20">
        <div className="p-6 flex items-center gap-2 mb-8 border-b border-white/10">
          <Library className="h-8 w-8" />
          <h1 className="text-2xl font-headline font-bold tracking-tight">NEULib Admin</h1>
        </div>
        
        <nav className="flex-grow px-4 space-y-2">
          <Button 
            variant="ghost" 
            className={cn(
              "w-full justify-start gap-3 transition-all",
              currentView === 'dashboard' ? "bg-white/20 text-white shadow-sm" : "text-white/70 hover:bg-white/10 hover:text-white"
            )}
            onClick={() => setCurrentView('dashboard')}
          >
            <LayoutDashboard className="h-5 w-5" />
            Dashboard
          </Button>
          <Button 
            variant="ghost" 
            className={cn(
              "w-full justify-start gap-3 transition-all",
              currentView === 'users' ? "bg-white/20 text-white shadow-sm" : "text-white/70 hover:bg-white/10 hover:text-white"
            )}
            onClick={() => setCurrentView('users')}
          >
            <Users className="h-5 w-5" />
            User Management
          </Button>
          <Button 
            variant="ghost" 
            className={cn(
              "w-full justify-start gap-3 transition-all",
              currentView === 'settings' ? "bg-white/20 text-white shadow-sm" : "text-white/70 hover:bg-white/10 hover:text-white"
            )}
            onClick={() => setCurrentView('settings')}
          >
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
      <main className="flex-1 p-4 md:p-8 lg:p-12 overflow-y-auto relative z-10">
        <header className="flex items-center justify-between mb-8 pb-6 border-b border-primary/10">
          <div>
            <p className="text-muted-foreground text-sm uppercase tracking-widest font-semibold">
              {currentView === 'dashboard' ? 'Overview' : currentView === 'users' ? 'Community' : 'Configuration'}
            </p>
            <h2 className="text-3xl font-headline font-bold text-primary">
              {currentView === 'dashboard' && "Welcome back, " + (user.displayName || 'Admin')}
              {currentView === 'users' && "User Management"}
              {currentView === 'settings' && "System Configuration"}
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold">{user.displayName || 'Administrator'}</p>
              <p className="text-xs text-muted-foreground">{user.email}</p>
            </div>
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold border-2 border-primary/20">
              {(user.displayName || user.email || 'A')[0].toUpperCase()}
            </div>
          </div>
        </header>

        <div className="animate-in fade-in duration-500">
          {currentView === 'dashboard' && <StatsDashboard />}
          {currentView === 'users' && <UserManagement />}
          {currentView === 'settings' && (
            <div className="flex items-center justify-center h-[50vh] text-muted-foreground">
              <div className="text-center space-y-2">
                <Settings className="h-12 w-12 mx-auto opacity-20" />
                <p>System settings are currently being optimized.</p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
