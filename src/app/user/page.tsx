'use client';

import React, { useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Library, ChevronLeft, Calendar as CalendarIcon, Clock, User as UserIcon, BookOpen, LogOut, Sparkles, School, Loader2, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { doc } from 'firebase/firestore';
import { useFirestore, useUser, useAuth, useMemoFirebase, useDoc } from '@/firebase';
import { format } from 'date-fns';
import { useRouter } from 'next/navigation';
import { signOut } from 'firebase/auth';

export default function UserDashboardPage() {
  const { user, isUserLoading } = useUser();
  const db = useFirestore();
  const auth = useAuth();
  const router = useRouter();
  
  useEffect(() => {
    if (!isUserLoading && !user) {
      router.replace('/user/login');
    }
  }, [user, isUserLoading, router]);

  const profileRef = useMemoFirebase(() => {
    if (!db || !user?.uid) return null;
    return doc(db, 'users', user.uid);
  }, [db, user?.uid]);

  const { data: profile } = useDoc(profileRef);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      router.replace('/');
    } catch (error) {
      console.error("Sign out failed", error);
    }
  };

  if (isUserLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-10 w-10 animate-spin text-primary mx-auto" />
          <p className="text-muted-foreground animate-pulse font-body text-sm">Verifying Session...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="p-4 border-b bg-white/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/">
              <Button variant="ghost" size="sm" className="gap-2">
                <ChevronLeft className="h-4 w-4" />
                Home
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <Library className="h-6 w-6 text-primary" />
              <span className="font-headline font-bold text-xl text-primary">NEULib Portal</span>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={handleSignOut} className="text-muted-foreground hover:text-destructive transition-colors">
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto p-4 md:p-8 space-y-8 max-w-4xl">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-semibold">
              <Sparkles className="h-4 w-4" />
              Member Access Portal
            </div>
            <div>
              <h1 className="text-4xl font-headline font-bold text-primary flex items-center gap-3">
                {user.displayName || user.email?.split('@')[0] || 'NEU Member'}
              </h1>
              <p className="text-muted-foreground mt-1">
                {profile && profile.role && profile.role !== 'Unassigned' 
                  ? `Active ${profile.role} • ${profile.college}`
                  : user.isAnonymous ? "Guest Session" : "Library Member Profile Active"}
              </p>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <Card className="bg-primary text-primary-foreground border-0 shadow-xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 -mt-4 -mr-4 h-24 w-24 bg-white/10 rounded-full blur-2xl group-hover:bg-white/20 transition-all" />
              <CardHeader>
                <CardTitle className="font-headline text-2xl flex items-center gap-2">
                  <UserIcon className="h-6 w-6" />
                  Quick Entry
                </CardTitle>
                <CardDescription className="text-primary-foreground/70">Record your current visit</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Link href="/check-in">
                  <Button className="w-full bg-white text-primary hover:bg-white/90 shadow-md h-12 text-lg font-semibold">
                    Check-in Now
                  </Button>
                </Link>
                <p className="text-[10px] text-center text-primary-foreground/50 uppercase tracking-tighter">
                  Member verification required
                </p>
              </CardContent>
            </Card>

            <Card className="bg-muted/30 border-dashed">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold flex items-center gap-2 text-muted-foreground">
                  Library Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-xs">
                <div className="flex justify-between">
                  <span>Operating Hours</span>
                  <span className="font-medium">8:00 AM - 9:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span>Location</span>
                  <span className="text-right">NEU Main Campus</span>
                </div>
                <Separator className="bg-muted-foreground/10" />
                <p className="text-center italic text-muted-foreground pt-1">
                  "Godliness is the foundation of knowledge."
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <School className="h-5 w-5 text-accent" />
                  Membership Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pt-4">
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between items-center border-b pb-2">
                    <span className="text-muted-foreground">College</span>
                    <span className="font-semibold text-primary">{profile?.college || 'Staff'}</span>
                  </div>
                  <div className="flex justify-between items-center border-b pb-2">
                    <span className="text-muted-foreground">Classification</span>
                    <span className="font-semibold text-primary">{profile?.role || 'Visitor'}</span>
                  </div>
                  <div className="flex justify-between items-center pt-1">
                    <span className="text-muted-foreground">Registration</span>
                    <span className="font-semibold">
                      {profile?.createdAt ? format(profile.createdAt.toDate(), 'MMMM yyyy') : format(new Date(), 'MMMM yyyy')}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-accent/10 bg-accent/5">
              <CardContent className="pt-6 text-center space-y-3">
                <Info className="h-6 w-6 text-accent mx-auto" />
                <h3 className="font-bold text-primary">Need Help?</h3>
                <p className="text-xs text-muted-foreground">
                  If your details are incorrect or you cannot access specific sections, please visit the main library counter.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}