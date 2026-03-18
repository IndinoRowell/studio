"use client"

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy } from 'firebase/firestore';
import { Search, Loader2, BookOpen, Calendar, Clock, ClipboardList } from 'lucide-react';
import { format } from 'date-fns';

export function VisitorLogList() {
  const db = useFirestore();
  const [searchTerm, setSearchTerm] = useState("");

  const logsQuery = useMemoFirebase(() => {
    if (!db) return null;
    return query(collection(db, 'visitorLogs'), orderBy('timestamp', 'desc'));
  }, [db]);

  const { data: logs, isLoading } = useCollection(logsQuery);

  const filteredLogs = useMemoFirebase(() => {
    if (!logs) return [];
    return logs.filter(log => 
      log.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.reason?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.college?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.employeeStatus?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [logs, searchTerm]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center gap-4">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search visitor records..." 
            className="pl-10" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Check-in Archive</CardTitle>
          <CardDescription>Viewing {filteredLogs.length} total visitor entries.</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 space-y-4">
              <Loader2 className="h-10 w-10 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">Retrieving secure logs...</p>
            </div>
          ) : filteredLogs.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Visitor</TableHead>
                  <TableHead>Activity</TableHead>
                  <TableHead>Affiliation</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date & Time</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLogs.map((log: any) => (
                  <TableRow key={log.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-primary/5 text-primary flex items-center justify-center text-xs font-bold border border-primary/10">
                          {log.name?.[0]?.toUpperCase() || 'V'}
                        </div>
                        {log.name || 'Anonymous'}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <BookOpen className="h-3 w-3 text-accent" />
                        <span className="text-sm">{log.reason}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-xs text-muted-foreground uppercase tracking-wider">{log.college}</span>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="text-[10px] font-bold">
                        {log.employeeStatus}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col text-[10px] text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-2 w-2" />
                          {log.timestamp ? format(log.timestamp.toDate(), 'MMM dd, yyyy') : '...'}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-2 w-2" />
                          {log.timestamp ? format(log.timestamp.toDate(), 'hh:mm aa') : '...'}
                        </span>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="py-20 text-center text-muted-foreground">
              <ClipboardList className="h-12 w-12 mx-auto mb-4 opacity-20" />
              <p>No visitor logs match your current search.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
