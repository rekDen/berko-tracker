export interface KpiRow {
  id: string;
  name: string;
  unit: string | null;
  target_value: number | null;
  created_at: string;
}

export interface KpiEntryRow {
  id: string;
  kpi_id: string;
  logged_date: string;
  value: number;
  note: string | null;
  created_at: string;
}
