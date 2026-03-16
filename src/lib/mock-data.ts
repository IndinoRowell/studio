import { VisitorLog, VisitReason, College, EmployeeStatus } from './types';
import { subDays } from 'date-fns';

const reasons: VisitReason[] = ['Study', 'Borrow/Return', 'Research', 'Computer Use', 'Meeting', 'Others'];
const colleges: College[] = [
  'Accountancy', 'Agriculture', 'Arts and Sciences', 'Business Administration', 
  'Communication', 'Criminology', 'Education', 'Engineering and Architecture', 
  'Informatics and Computing Studies', 'Law', 'Music', 'International Relations', 
  'Medicine', 'Nursing', 'Medical Technology', 'Physical Therapy', 
  'Respiratory Therapy', 'Midwifery', 'Graduate Studies', 'Basic Education'
];
const statuses: EmployeeStatus[] = ['Student', 'Faculty', 'Staff'];

export const generateMockLogs = (count: number = 100, days: number = 30): VisitorLog[] => {
  const logs: VisitorLog[] = [];
  const now = new Date();

  for (let i = 0; i < count; i++) {
    const randomDaysAgo = Math.floor(Math.random() * days);
    const randomHours = Math.floor(Math.random() * 24);
    const randomMinutes = Math.floor(Math.random() * 60);
    
    const timestamp = subDays(now, randomDaysAgo);
    timestamp.setHours(randomHours, randomMinutes);

    logs.push({
      id: `mock-log-${i}`,
      timestamp,
      reason: reasons[Math.floor(Math.random() * reasons.length)],
      college: colleges[Math.floor(Math.random() * colleges.length)],
      employeeStatus: statuses[Math.floor(Math.random() * statuses.length)],
      name: `Visitor ${i}`,
    });
  }

  return logs.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
};
