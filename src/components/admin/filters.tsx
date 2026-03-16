"use client"

import { StatisticsFilter } from "@/lib/types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { XCircle } from "lucide-react";

interface AdminFiltersProps {
  onFilterChange: (filters: Partial<StatisticsFilter>) => void;
}

export function AdminFilters({ onFilterChange }: AdminFiltersProps) {
  const handleChange = (key: keyof StatisticsFilter, value: string) => {
    onFilterChange({ [key]: value === 'all' ? undefined : value });
  };

  const clearFilters = () => {
    onFilterChange({});
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border flex flex-wrap items-end gap-4">
      <div className="space-y-2 flex-1 min-w-[200px]">
        <Label className="text-xs uppercase tracking-wider text-muted-foreground">Reason</Label>
        <Select onValueChange={(v) => handleChange('reason', v)}>
          <SelectTrigger>
            <SelectValue placeholder="All Reasons" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Reasons</SelectItem>
            <SelectItem value="Study">Study</SelectItem>
            <SelectItem value="Borrow/Return">Borrow/Return</SelectItem>
            <SelectItem value="Research">Research</SelectItem>
            <SelectItem value="Computer Use">Computer Use</SelectItem>
            <SelectItem value="Meeting">Meeting</SelectItem>
            <SelectItem value="Others">Others</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2 flex-1 min-w-[200px]">
        <Label className="text-xs uppercase tracking-wider text-muted-foreground">College</Label>
        <Select onValueChange={(v) => handleChange('college', v)}>
          <SelectTrigger>
            <SelectValue placeholder="All Colleges" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Colleges</SelectItem>
            <SelectItem value="Accountancy">Accountancy</SelectItem>
            <SelectItem value="Agriculture">Agriculture</SelectItem>
            <SelectItem value="Arts and Sciences">Arts and Sciences</SelectItem>
            <SelectItem value="Business Administration">Business Administration</SelectItem>
            <SelectItem value="Communication">Communication</SelectItem>
            <SelectItem value="Criminology">Criminology</SelectItem>
            <SelectItem value="Education">Education</SelectItem>
            <SelectItem value="Engineering and Architecture">Engineering and Architecture</SelectItem>
            <SelectItem value="Informatics and Computing Studies">Informatics and Computing Studies</SelectItem>
            <SelectItem value="Law">Law</SelectItem>
            <SelectItem value="Music">Music</SelectItem>
            <SelectItem value="International Relations">International Relations</SelectItem>
            <SelectItem value="Medicine">Medicine</SelectItem>
            <SelectItem value="Nursing">Nursing</SelectItem>
            <SelectItem value="Medical Technology">Medical Technology</SelectItem>
            <SelectItem value="Physical Therapy">Physical Therapy</SelectItem>
            <SelectItem value="Respiratory Therapy">Respiratory Therapy</SelectItem>
            <SelectItem value="Midwifery">Midwifery</SelectItem>
            <SelectItem value="Graduate Studies">Graduate Studies</SelectItem>
            <SelectItem value="Basic Education">Basic Education</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2 flex-1 min-w-[200px]">
        <Label className="text-xs uppercase tracking-wider text-muted-foreground">Status</Label>
        <Select onValueChange={(v) => handleChange('employeeStatus', v)}>
          <SelectTrigger>
            <SelectValue placeholder="All Statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="Student">Student</SelectItem>
            <SelectItem value="Faculty">Faculty</SelectItem>
            <SelectItem value="Staff">Staff</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button variant="outline" className="gap-2" onClick={clearFilters}>
        <XCircle className="h-4 w-4" />
        Reset
      </Button>
    </div>
  );
}
