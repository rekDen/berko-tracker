export interface ProductivityLogRow {
  id: string;
  logged_date: string;
  task: string;
  category: string | null;
  duration_min: number | null;
  completed: boolean;
  note: string | null;
  created_at: string;
}
