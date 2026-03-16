export type Role = 'Visitor' | 'Admin';

export type VisitReason = 'Study' | 'Borrow/Return' | 'Research' | 'Computer Use' | 'Meeting' | 'Others';

export type College = 'CAS' | 'CBA' | 'CED' | 'CEAS' | 'CHM' | 'CON' | 'LAW' | 'Graduate School';

export type EmployeeStatus = 'Student' | 'Faculty' | 'Staff';

export interface VisitorLog {
  id: string;
  timestamp: Date;
  reason: VisitReason;
  college: College;
  employeeStatus: EmployeeStatus;
  name?: string;
}

export interface StatisticsFilter {
  dateRange: { from: Date; to: Date };
  reason?: VisitReason;
  college?: College;
  employeeStatus?: EmployeeStatus;
}
