'use client';

import React, { useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Library, ChevronLeft, Calendar as CalendarIcon, Clock, User as UserIcon, BookOpen, LogOut, Sparkles, School, ShieldCheck, Loader2, ArrowRightLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { collection, query, orderBy, limit, where, doc } from 'firebase/firestore';
import { useFirestore, useCollection, useUser, useAuth, useMemoFirebase, useDoc } from '@/firebase';
import { format } from 'date-fns';
import { Badge } from "@/components/ui/badge";
import { useRouter } from 'next/navigation';
import { signOut } from 'firebase/auth';

export default function UserDashboardPage() {
  const { user, isUserLoading, isAdmin, isAdminLoading } = useUser();
  const db = useFirestore();
  const auth = useAuth();
  const router = useRouter();
  
  useEffect(() => {
    if (!isUserLoading && !user) {
      router.replace('/user/login');
    }
  }, [user, isUserLoading, router]);

  // Fetch the user's profile from the users collection by UID
  const profileRef = useMemoFirebase(() => {
    if (!db || !user?.uid) return null;
    return doc(db, 'users', user.uid);
  }, [db, user?.uid]);

  const { data: profile } = useDoc(profileRef);

  // Fetch recent check-ins for the user
  const recentLogsQuery = useMemoFirebase(() => {
    if (!db || !user?.uid) return null;
    return query(
      collection(db, 'visitorLogs'),
      where('visitorId', '==', user.uid),
      orderBy('timestamp', 'desc'),
      limit(10)
    );
  }, [db, user?.uid]);

  const { data: logs, isLoading: logsLoading } = useCollection(recentLogsQuery);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      router.replace('/');
    } catch (error) {
      console.error("Sign out failed", error);
    }
  };

  if (isUserLoading || isAdminLoading) {
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
            {isAdmin && (
              <Link href="/admin">
                <Button variant="default" size="sm" className="gap-2 bg-primary hover:bg-primary/90">
                  <ShieldCheck className="h-4 w-4" />
                  <span className="hidden sm:inline">Admin Dashboard</span>
                  <span className="sm:hidden">Admin</span>
                </Button>
              </Link>
            )}

            <Button variant="ghost" size="sm" onClick={handleSignOut} className="text-muted-foreground hover:text-destructive">
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto p-4 md:p-8 space-y-8 max-w-7xl">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-semibold">
              <Sparkles className="h-4 w-4" />
              Welcome back to your Library Portal
            </div>
            <div>
              <h1 className="text-4xl font-headline font-bold text-primary flex items-center gap-3">
                {user.displayName || user.email?.split('@')[0]}
                {isAdmin && <Badge variant="secondary" className="font-body text-[10px] bg-accent/20 text-accent border-accent/20">ADMIN ACCOUNT</Badge>}
              </h1>
              <p className="text-muted-foreground mt-1">
                {profile && profile.role !== 'Unassigned' 
                  ? `Authenticated as ${profile.role} • ${profile.college}`
                  : "Member Profile Active"}
              </p>
            </div>
          </div>
          
          {isAdmin && (
            <div className="flex gap-2">
              <Link href="/admin" className="w-full">
                <Button variant="outline" className="w-full gap-2 border-primary/20 hover:bg-primary/5 text-primary">
                  <ArrowRightLeft className="h-4 w-4" />
                  Switch to Admin View
                </Button>
              </Link>
            </div>
          )}
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-2 border-primary/5 shadow-sm">
              <CardHeader className="border-b bg-muted/20">
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Clock className="h-5 w-5 text-accent" />
                  Recent Activity
                </CardTitle>
                <CardDescription>Your personal library entry records</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                {logsLoading ? (
                  <div className="py-12 flex flex-col items-center justify-center text-muted-foreground space-y-4">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <p>Fetching your records...</p>
                  </div>
                ) : logs && logs.length > 0 ? (
                  <div className="space-y-4">
                    {logs.map((log: any) => (
                      <div key={log.id} className="flex items-center justify-between p-4 rounded-xl border bg-card hover:border-accent/30 hover:bg-accent/5 transition-all group">
                        <div className="flex items-center gap-4">
                          <div className="h-10 w-10 rounded-full bg-accent/10 flex items-center justify-center text-accent">
                            <BookOpen className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="font-semibold text-foreground">{log.reason}</p>
                            <p className="text-xs text-muted-foreground flex items-center gap-1">
                              <CalendarIcon className="h-3 w-3" />
                              {log.timestamp ? format(log.timestamp.toDate(), 'PPP p') : 'Processing...'}
                            </p>
                          </div>
                        </div>
                        <Badge variant="outline" className="opacity-60 group-hover:opacity-100 transition-opacity">
                          {log.college}
                        </Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-20 text-center border-2 border-dashed rounded-xl space-y-4 bg-muted/10">
                    <div className="h-12 w-12 bg-muted rounded-full flex items-center justify-center mx-auto">
                      <BookOpen className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <div className="space-y-2">
                      <p className="font-semibold">No recent visits</p>
                      <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                        Your library entries will appear here. Visit the library and check-in to see your history.
                      </p>
                    </div>
                    <Link href="/check-in">
                      <Button variant="secondary" size="sm">Record your first visit</Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="bg-primary text-primary-foreground border-0 shadow-xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 -mt-4 -mr-4 h-24 w-24 bg-white/10 rounded-full blur-2xl group-hover:bg-white/20 transition-all" />
              <CardHeader>
                <CardTitle className="font-headline text-2xl flex items-center gap-2">
                  <UserIcon className="h-6 w-6" />
                  Quick Entry
                </CardTitle>
                <CardDescription className="text-primary-foreground/70">Scan or manually record your visit</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Link href="/check-in">
                  <Button className="w-full bg-white text-primary hover:bg-white/90 shadow-md h-12 text-lg font-semibold">
                    Check-in Now
                  </Button>
                </Link>
                <p className="text-[10px] text-center text-primary-foreground/50 uppercase tracking-tighter">
                  Authorized access for NEU community members
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <School className="h-5 w-5 text-accent" />
                  Profile Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pt-4">
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between items-center border-b pb-2">
                    <span className="text-muted-foreground">Affiliation</span>
                    <span className="font-semibold text-primary">{profile?.college || 'Staff'}</span>
                  </div>
                  <div className="flex justify-between items-center border-b pb-2">
                    <span className="text-muted-foreground">Primary Role</span>
                    <span className="font-semibold text-primary">{profile?.role || (isAdmin ? 'Administrator' : 'Visitor')}</span>
                  </div>
                  <div className="flex justify-between items-center pt-1">
                    <span className="text-muted-foreground">Member Since</span>
                    <span className="font-semibold">
                      {profile?.createdAt ? format(profile.createdAt.toDate(), 'MMMM yyyy') : format(new Date(), 'MMMM yyyy')}
                    </span>
                  </div>
                </div>
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
        </div>
      </main>
    </div>
  );
}
