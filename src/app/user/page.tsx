"use client"

import { useMemo, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Library, ChevronLeft, Calendar as CalendarIcon, Clock, User as UserIcon, BookOpen, LogOut, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { collection, query, orderBy, limit } from 'firebase/firestore';
import { useFirestore, useCollection, useUser, useAuth } from '@/firebase';
import { format } from 'date-fns';
import { Badge } from "@/components/ui/badge";
import { useRouter } from 'next/navigation';
import { signOut } from 'firebase/auth';

export default function UserDashboardPage() {
  const { user, loading: userLoading } = useUser();
  const db = useFirestore();
  const auth = useAuth();
  const router = useRouter();
  
  useEffect(() => {
    if (!userLoading && !user) {
      router.push('/user/login');
    }
  }, [user, userLoading, router]);

  const recentLogsQuery = useMemo(() => {
    return query(
      collection(db, 'logs'),
      orderBy('timestamp', 'desc'),
      limit(10)
    );
  }, [db]);

  const { data: logs, loading: logsLoading } = useCollection(recentLogsQuery);

  const handleSignOut = async () => {
    await signOut(auth);
    router.push('/');
  };

  if (userLoading) {
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
            <p className="text-muted-foreground">Hello, {user.displayName || user.email}. View your library activity here.</p>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-accent" />
                  Recent Library Activity
                </CardTitle>
                <CardDescription>The latest entries recorded in the system.</CardDescription>
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
                    <p>No recent activity found.</p>
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
                    "Educating the soul is the heart of education."
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
