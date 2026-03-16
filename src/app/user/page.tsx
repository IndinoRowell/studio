"use client"

import React, { useMemo, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Library, ChevronLeft, Calendar as CalendarIcon, Clock, User as UserIcon, BookOpen, LogOut, Sparkles, School, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { collection, query, orderBy, limit, where, doc } from 'firebase/firestore';
import { useFirestore, useCollection, useUser, useAuth, useMemoFirebase, useDoc } from '@/firebase';
import { format } from 'date-fns';
import { Badge } from "@/components/ui/badge";
import { useRouter } from 'next/navigation';
import { signOut } from 'firebase/auth';

export default function UserDashboardPage(props: {
  params: Promise<any>;
  searchParams: Promise<any>;
}) {
  const { user, isUserLoading, isAdmin, isAdminLoading } = useUser();
  const db = useFirestore();
  const auth = useAuth();
  const router = useRouter();
  
  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/user/login');
    }
  }, [user, isUserLoading, router]);

  // Fetch the user's profile from the users collection by UID
  const profileRef = useMemoFirebase(() => {
    if (!db || !user?.uid) return null;
    return doc(db, 'users', user.uid);
  }, [db, user?.uid]);

  const { data: profile, isLoading: profileLoading } = useDoc(profileRef);

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
    await signOut(auth);
    router.push('/');
  };

  if (isUserLoading || isAdminLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="p-4 border-b bg-white/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto flex items-center justify-between">
          <Link href="/">
            <Button variant="ghost" className="gap-2">
              <ChevronLeft className="h-4 w-4" />
              Home
            </Button>
          </Link>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Library className="h-5 w-5 text-primary" />
              <span className="font-headline font-bold text-primary">NEULib</span>
            </div>
            
            {isAdmin && (
              <Link href="/admin">
                <Button variant="outline" size="sm" className="gap-2 text-primary border-primary hover:bg-primary hover:text-white">
                  <ShieldCheck className="h-4 w-4" />
                  Admin Dashboard
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
      
      <main className="container mx-auto p-4 md:p-8 space-y-8">
        <header className="space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-semibold animate-in fade-in slide-in-from-left-4 duration-700">
            <Sparkles className="h-4 w-4" />
            Welcome to NEU Library!
          </div>
          <div>
            <h1 className="text-4xl font-headline font-bold text-primary">User Dashboard</h1>
            <p className="text-muted-foreground">
              Hello, {user.displayName || user.email}. 
              {profile && ` You are recognized as a ${profile.role} from the College of ${profile.college}.`}
            </p>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-accent" />
                  Your Recent Library Activity
                </CardTitle>
                <CardDescription>Your latest entries recorded in the system.</CardDescription>
              </CardHeader>
              <CardContent>
                {logsLoading ? (
                  <div className="py-12 flex flex-col items-center justify-center text-muted-foreground space-y-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    <p>Loading activity log...</p>
                  </div>
                ) : logs && logs.length > 0 ? (
                  <div className="space-y-4">
                    {logs.map((log: any) => (
                      <div key={log.id} className="flex items-start justify-between p-4 rounded-lg border bg-card hover:bg-accent/5 transition-colors">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-foreground">{log.name || 'Anonymous User'}</span>
                            <Badge variant="secondary" className="text-[10px] uppercase tracking-wider">{log.employeeStatus}</Badge>
                          </div>
                          <div className="text-sm text-muted-foreground flex flex-wrap gap-x-4">
                            <span className="flex items-center gap-1">
                              <BookOpen className="h-3 w-3" />
                              {log.reason}
                            </span>
                            <span className="flex items-center gap-1">
                              <CalendarIcon className="h-3 w-3" />
                              {log.timestamp ? format(log.timestamp.toDate(), 'MMM d, yyyy h:mm a') : 'Just now'}
                            </span>
                          </div>
                        </div>
                        <div className="text-xs text-muted-foreground font-medium hidden sm:block">
                          {log.college}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-12 text-center text-muted-foreground border-2 border-dashed rounded-lg">
                    <p>No recent activity found. Visit the library and check-in!</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="bg-primary text-primary-foreground border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="font-headline flex items-center gap-2">
                  <UserIcon className="h-5 w-5" />
                  Quick Check-in
                </CardTitle>
                <CardDescription className="text-primary-foreground/70">Ready for your session?</CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/check-in">
                  <Button className="w-full bg-white text-primary hover:bg-white/90">
                    Check-in Now
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {profile && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <School className="h-5 w-5 text-accent" />
                    Profile Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div className="flex justify-between border-b pb-2">
                    <span className="text-muted-foreground">Affiliation</span>
                    <span className="font-medium">{profile.college}</span>
                  </div>
                  <div className="flex justify-between border-b pb-2">
                    <span className="text-muted-foreground">Role</span>
                    <span className="font-medium">{profile.role}</span>
                  </div>
                  <div className="flex justify-between pt-1">
                    <span className="text-muted-foreground">Member Since</span>
                    <span className="font-medium">
                      {profile.createdAt ? format(profile.createdAt.toDate(), 'MMM yyyy') : 'N/A'}
                    </span>
                  </div>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Library Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <div className="flex justify-between border-b pb-2">
                  <span className="text-muted-foreground">Operating Hours</span>
                  <span className="font-medium">8:00 AM - 9:00 PM</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-muted-foreground">Location</span>
                  <span className="font-medium text-right">Main Campus, Quezon City</span>
                </div>
                <div className="pt-2">
                  <p className="text-muted-foreground leading-relaxed italic">
                    "Godliness is the foundation of knowledge."
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
