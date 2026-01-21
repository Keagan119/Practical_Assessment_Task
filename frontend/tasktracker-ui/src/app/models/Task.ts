export interface TaskItem {
  id: number;
  title: string;
  description?: string;
  status: string;    // or your enum type
  priority: string;  // or your enum type
  dueDate?: string;  // ISO string
  createdAt: string; // ISO string
}