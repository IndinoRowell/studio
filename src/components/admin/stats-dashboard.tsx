"use client"

import { useState, useMemo, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { generateMockLogs } from "@/lib/mock-data";
import { StatisticsFilter, VisitorLog } from "@/lib/types";
import { isSameDay, isWithinInterval, startOfWeek } from "date-fns";
import { Users, BookOpen, GraduationCap, Briefcase, Loader2 } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { AdminFilters } from './filters';
import { AIInsights } from './ai-insights';

const COLORS = ['#2e3a75', '#3385cc', '#4f46e5', '#6366f1', '#818cf8', '#a5b4fc', '#c7d2fe', '#e0e7ff'];

export function StatsDashboard() {
  const [activeTab, setActiveTab] = useState('today');
  const [filters, setFilters] = useState<Partial<StatisticsFilter>>({});
  const [isMounted, setIsMounted] = useState(false);
  const [allLogs, setAllLogs] = useState<VisitorLog[]>([]);

  useEffect(() => {
    // Generate mock data only on client to avoid hydration mismatch
    setAllLogs(generateMockLogs(500));
    setIsMounted(true);
  }, []);

  const filteredLogs = useMemo(() => {
    if (!isMounted) return [];
    
    let logs = allLogs;
    const now = new Date();

    // Time filter
    if (activeTab === 'today') {
      logs = logs.filter(log => isSameDay(log.timestamp, now));
    } else if (activeTab === 'week') {
      const start = startOfWeek(now);
      logs = logs.filter(log => isWithinInterval(log.timestamp, { start, end: now }));
    }

    // Advanced filters
    if (filters.reason) {
      logs = logs.filter(log => log.reason === filters.reason);
    }
    if (filters.college) {
      logs = logs.filter(log => log.college === filters.college);
    }
    if (filters.employeeStatus) {
      logs = logs.filter(log => log.employeeStatus === filters.employeeStatus);
    }

    return logs;
  }, [activeTab, filters, allLogs, isMounted]);

  const stats = useMemo(() => {
    const total = filteredLogs.length;
    
    const reasonCounts = filteredLogs.reduce((acc, log) => {
      acc[log.reason] = (acc[log.reason] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const collegeCounts = filteredLogs.reduce((acc, log) => {
      acc[log.college] = (acc[log.college] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const statusCounts = filteredLogs.reduce((acc, log) => {
      acc[log.employeeStatus] = (acc[log.employeeStatus] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return { total, reasonCounts, collegeCounts, statusCounts };
  }, [filteredLogs]);

  const pieData = Object.entries(stats.reasonCounts).map(([name, value]) => ({ name, value }));
  const barData = Object.entries(stats.collegeCounts).map(([name, value]) => ({ name, value }));

  if (!isMounted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-muted-foreground animate-pulse font-body text-sm uppercase tracking-widest">
          Synchronizing Library Analytics...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-headline font-bold text-primary">Visitor Analytics</h2>
          <p className="text-muted-foreground">Monitor library usage patterns and visitor demographics.</p>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-fit">
          <TabsList>
            <TabsTrigger value="today">Today</TabsTrigger>
            <TabsTrigger value="week">This Week</TabsTrigger>
            <TabsTrigger value="all">All Time</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <AdminFilters onFilterChange={setFilters} />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-primary shadow-sm">
          <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Total Visitors</CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground mt-1">Visitors in selected range</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-accent shadow-sm">
          <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Main Reason</CardTitle>
            <BookOpen className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold truncate">
              {Object.entries(stats.reasonCounts).sort((a,b) => b[1] - a[1])[0]?.[0] || 'N/A'}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Most common activity</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-indigo-500 shadow-sm">
          <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Top College</CardTitle>
            <GraduationCap className="h-4 w-4 text-indigo-500" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold">
              {Object.entries(stats.collegeCounts).sort((a,b) => b[1] - a[1])[0]?.[0] || 'N/A'}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Highest attendance</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-400 shadow-sm">
          <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Staff/Faculty</CardTitle>
            <Briefcase className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {((stats.statusCounts['Faculty'] || 0) + (stats.statusCounts['Staff'] || 0))}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Non-student visitors</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Reason for Visiting</CardTitle>
            <CardDescription>Distribution of library activities</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-headline">College Attendance</CardTitle>
            <CardDescription>Visitor count per college affiliation</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" fontSize={10} tickLine={false} axisLine={false} interval={0} angle={-45} textAnchor="end" height={80} />
                <YAxis fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip />
                <Bar dataKey="value" fill="#3385cc" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <AIInsights 
        dateRange={activeTab === 'today' ? 'Today' : activeTab === 'week' ? 'This Week' : 'All time'}
        totalVisitors={stats.total}
        reasonBreakdown={stats.reasonCounts}
        collegeBreakdown={stats.collegeCounts}
        employeeStatusBreakdown={stats.statusCounts}
      />
    </div>
  );
}
