export type Role = 'Visitor' | 'Admin';

export type VisitReason = 'Study' | 'Borrow/Return' | 'Research' | 'Computer Use' | 'Meeting' | 'Others';

export type College = 
  | 'Accountancy' 
  | 'Agriculture' 
  | 'Arts and Sciences' 
  | 'Business Administration' 
  | 'Communication' 
  | 'Criminology' 
  | 'Education' 
  | 'Engineering and Architecture' 
  | 'Informatics and Computing Studies' 
  | 'Law' 
  | 'Music' 
  | 'International Relations' 
  | 'Medicine' 
  | 'Nursing' 
  | 'Medical Technology' 
  | 'Physical Therapy' 
  | 'Respiratory Therapy' 
  | 'Midwifery' 
  | 'Graduate Studies' 
  | 'Basic Education';

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

export type EmployeeStatus = 'Student' | 'Faculty' | 'Staff';
